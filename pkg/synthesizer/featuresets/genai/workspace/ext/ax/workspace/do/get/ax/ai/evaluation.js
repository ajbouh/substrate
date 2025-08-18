import {ax, s, AxAIOpenAIBase, AxOptimizedProgramImpl} from "../../../../../lib/ax.js"

export default async function (handlerInputs) {
    const {action, unit, name, inputs: {attribute}={}, workspace} = handlerInputs

    const config = JSON.parse(unit.source)
    const ai = new AxAIOpenAIBase({
        ...config,
        options: {logger: (message) => workspace.log(message)}, // workaround the default logger being process.stdout
    })

    return async function (handlerInputs) {
        const {action, unit, name, inputs: {attribute}={}, workspace} = handlerInputs
        let signature, optimizedProgram
        if (unit.source.startsWith('{')) {
            ({signature, optimizedProgram} = JSON.parse(unit.source));
        } else {
            signature = s(unit.source)
        }

        const axgen = ax(signature)
        if (optimizedProgram) {
            const optimizedProgramImpl = new AxOptimizedProgramImpl(optimizedProgram)
            axgen.applyOptimization(optimizedProgramImpl)
        }

        return async (inputs) => {
            return await axgen.forward(ai, inputs)
        }
    }
}
