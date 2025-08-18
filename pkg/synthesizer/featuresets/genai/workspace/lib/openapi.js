import jsdocRenderSignature from '@workspace/lib/jsdoc-render-signature'
import jsonpointer from '@workspace/lib/jsonpointer'

export const openapiGenerator = ({schema, path, method, status, bodyInput, requestType, responseType, outputsFromResponse, errorsFromResponse}) => {
    const pathSchema = schema.paths[path]
    if (!pathSchema) {
      throw new Error(`path not present in schema: ${path}; valid paths are: ${JSON.stringify(Object.keys(schema.paths))}`)
    }

    const operationSchema = pathSchema[method]
    if (!operationSchema) {
      throw new Error(`method not present in schema: ${method}; valid methods are: ${JSON.stringify(Object.keys(pathSchema))}`)
    }

    const resolve = s => s?.["$ref"] ? jsonpointer.get(schema, s["$ref"]) : s
    const propertiesOf = o => {
      o = resolve(o)
      if (o.type !== 'object') {
        return []
      }
      const {allOf, oneOf} = o
      return Array.isArray(allOf)
        ? allOf.flatMap(o2 => propertiesOf(o2))
        : Array.isArray(oneOf)
        ? propertiesOf(oneOf.items.map(item => resolve(item))[0]) // HACK pick the first option and just use that
        : Object.entries(o.properties || {}).map(([name, property]) => [name, resolve(property), {required: o.required?.includes(name)}])
    }
    const fieldsForSchema = (...o) => {
      const v = fieldsForSchema0(...o)
      return v
    }
    const fieldsForSchemaProperties = (schema, {prefix}={}) => (
      schema?.type === 'object'
      ? propertiesOf(schema).flatMap(
          ([fieldName, fieldSchema, {required}]) => fieldsForSchema(fieldSchema, {
            name: prefix ? `${prefix}.${fieldName}` : fieldName,
            required,
          }))
      : schema?.type === 'array'
      ? fieldsForSchema(resolve(schema.items), {
          name: prefix ? `${prefix}[]` : '[]',
        })
      : []
    )
    const fieldsForSchema0 = (schema, {name, description, required}={}) => [
      {
        name,
        description: description ?? schema.description,
        isOptional: !required,
        type: {
          name: (schema?.type === 'string' && schema?.format === 'binary')
          ? 'blob'
          : schema?.type,
        },
      },
      ...fieldsForSchemaProperties(schema, {prefix: name})
    ]

    const inputFieldFromBody = () => {
      // todo
      return {}
    }

    const outputFieldsFromRef = (name, responseSchema, ref) => {
      const compiled = jsonpointer.compile(ref)
      const refSchema = compiled.compiled.slice(1).reduce(
        (acc, key) => resolve(acc.properties?.[key]), responseSchema)
      return fieldsForSchema(refSchema, {
        name,
        description,
      })
    }
    const outputFieldsFromContentSchema = (responseContentSchema) =>
      propertiesOf(responseContentSchema).flatMap(
        ([name, prop, {required}]) => fieldsForSchema(prop, {name, description: prop.description, required})
      )

    const server = schema.servers[0]
    if (!server) {
      throw new Error(`server not present in schema`)
    }

    const url =`${server.url}${path}`

    const description = [
      operationSchema.summary,
      operationSchema.description,
    ].filter(_ => _).join("\n")

    const signature = {
      description,
      inputs: [],
      outputs: [],
    }

    if (status === undefined) {
      // default to the first status
      status = Object.keys(operationSchema?.responses || {})[0]
    }

    if (responseType === undefined) {
      responseType = "application/json"
    }

    let responseSchema = resolve(operationSchema?.responses?.[status])
    const unresolvedResponseContentSchema = responseSchema.content?.[responseType]?.schema
    if (!unresolvedResponseContentSchema) {
      throw new Error(`no response content schema for type ${responseType}`)
    }
    const responseContentSchema = resolve(unresolvedResponseContentSchema)

    if (!outputsFromResponse && responseContentSchema.type !== 'object') {
      outputsFromResponse = {
        'content': '#/body',
      }
    }

    if (outputsFromResponse) {
      const responseSchemaForOutputs = {
        ...responseSchema,
        properties: {
          body: responseContentSchema,
        },
      }
      for (const [outputKey, responseRef] of Object.entries(outputsFromResponse)) {
        signature.outputs.push(...outputFieldsFromRef(outputKey, responseSchemaForOutputs, responseRef))
      }
    } else {
      signature.outputs.push(...outputFieldsFromContentSchema(responseContentSchema)) 
    }

    const pathInputs = []
    const queryInputs = []
    const baseRequest = {
        method,
        headers: {},
        url,
        query: {},
        path: {},
        body: undefined,
    }

    if (operationSchema.parameters) {
      for (const parameter of operationSchema.parameters) {
        const enumValue = parameter?.schema?.enum
        const staticValue = enumValue?.length === 1 ? enumValue[0] : undefined
        const defaultValue = parameter?.schema?.default ?? staticValue
        switch (parameter.in) {
        case 'path':
          if (defaultValue !== undefined) {
            baseRequest.path[parameter.name] = defaultValue
          }
          if (staticValue !== undefined) {
            continue
          }
          pathInputs.push(parameter.name)
          break
        case 'query':
          if (defaultValue !== undefined) {
            baseRequest.query[parameter.name] = defaultValue
          }
          if (staticValue !== undefined) {
            continue
          }
          queryInputs.push(parameter.name)
          break
        default:
          throw new Error(`unsupported .in value for parameter ${parameter.name}: ${parameter.in}; ${JSON.stringify(parameter)}`)
        }

        signature.inputs.push(...fieldsForSchema(parameter.schema, parameter))
      }
    }

    if (operationSchema.requestBody) {
      const requestBody = resolve(operationSchema.requestBody)
      // requestBody.required
      if (requestType === undefined) {
        requestType = Object.keys(requestBody.content)[0]
      }
      if (bodyInput === undefined) {
        bodyInput = (pathInputs.length > 0 || queryInputs > 0) ? 'payload' : ''
      }

      const requestBodyContent = requestBody.content[requestType]
      const requestSchema = resolve(requestBodyContent?.schema)

      if (!requestSchema) {
        throw new Error(`no request body content schema for type ${requestType}`)
      }

      if (bodyInput === '') {
        signature.inputs.push(...fieldsForSchemaProperties(requestSchema, {prefix: ''}))
      } else {
        signature.inputs.push(...fieldsForSchema(requestSchema, {
          name: bodyInput,
          description: requestBodyContent.description,
          required: requestBodyContent.required,
        }))
      }
    }

    return {
      format: 'fetch',
      signature,
      baseRequest,
      pathInputs,
      queryInputs,
      bodyInput,
      demandStatus: status !== undefined ? +status : undefined,
      outputsFromResponse,
      errorsFromResponse,
    }
}

const fetchText = url => fetch(new URL(url, import.meta.url).toString()).then(response => response.ok
    ? response.text()
    : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}"`)))

const fetchJSON = url => fetch(new URL(url, import.meta.url).toString()).then(response => response.ok
    ? response.json()
    : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}"`)))

    const enumerateServiceOperations = function* (schema) {
  for (const path in schema.paths) {
    const pathSchema = schema.paths[path]
    for (const method in pathSchema) {
      const operationSchema = pathSchema[method]
      const operationID = operationSchema.operationId

      yield {
        operationID,
        path,
        method,
        operationSchema,
        schema,
      }
    }
  }
}

const functionFromOpenAPIOperation = ({operation, outputsFromResponse, errorsFromResponse}) => {
  const {schema, operationID, path, method, operationSchema} = operation
  const status = Object.keys(operationSchema.responses)[0]
  const statusSchema = operationSchema.responses[status]
  const responseType = Object.keys(statusSchema.content)[0]
  const responseContentSchema = statusSchema.content[responseType]?.schema

  if (outputsFromResponse == null && responseContentSchema?.type === 'object') {
    const topLevelProperties = Object.keys(responseContentSchema?.properties)
    if (topLevelProperties.length === 1) {
      const topLevelPropertyName = topLevelProperties[0] 
      const topLevelPropertyValue = responseContentSchema?.properties[topLevelPropertyName] 
      if (topLevelPropertyValue.type === 'object') {
        outputsFromResponse = {}
        const path = `#/body/${topLevelPropertyName}`
        for (const k in topLevelPropertyValue.properties) {
          outputsFromResponse[k] = `${path}/${k}`
        }
      }
    }
  }

  const name = operationID
  const gen = openapiGenerator({schema, path, method, responseType, outputsFromResponse, errorsFromResponse})
  const {jsdoc} = jsdocRenderSignature({name, virtual: true, global: true, async: true, signature: gen.signature})

  return {
    source: JSON.stringify(gen),
    type: 'openapi-request',
    docs: jsdoc,
    internalName: operationID,
    // note that this might be a url template. so ... that's not great? maybe make url a function which accepts inputs?
    url: schema.servers[0].url + operation.path,
  }
}

export const enumerateServiceFunctions = (schema, operationSpecificOptions, operationIDPattern=/./) =>
  enumerateServiceOperations(schema).flatMap((operation) => operationIDPattern.test(operation.operationID)
    ? [functionFromOpenAPIOperation({
        operation,
        ...(operationSpecificOptions?.[operation.operationID] || {}),
      })]
    : [])

export const fetchServiceSchema = async (server, serviceName) => {
  const schema = await fetchJSON(`${server}/spaceview;space=image:${serviceName}/tree/openapi.json`)
  schema.servers[0].url = `${server}/${serviceName}`
  return schema
}

export const fetchVendorSchema = async (name) => await fetchJSON(`tools/${name}.openapi.json`)

