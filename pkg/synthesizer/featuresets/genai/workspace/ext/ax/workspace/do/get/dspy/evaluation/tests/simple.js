export default async function({unit: axProgramEvaluationHandler, workspace}) {
    const unit = workspace.unit.dspy`sentence -> subject?, verb?, indirect_object?, direct_object?`
    const fn = await axProgramEvaluationHandler({workspace, unit})
    const sentence = "the quick brown fox jumped over the lazy dog"
    const sentenceParts = await fn({sentence})
    if (sentenceParts.verb !== "jumped") {
        throw new Error(`sentenceParts for ${sentence} is wrong: ${JSON.stringify(sentenceParts)}`)
    }
    console.log("PASS testID=workspace/do/get/dspy/evaluation/tests/simple")
}
