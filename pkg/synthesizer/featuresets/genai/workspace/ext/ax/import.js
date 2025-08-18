import importUnits from '../../lib/import-units.js';
import { axAIUnit } from './lib/ax-units.js';

export default async function({url, createChatCompletion}) {
    return {
        // does an internal import that we need to handle
        'workspace/do/get/ax/ai/evaluation': {evaluation: (await import('./workspace/do/get/ax/ai/evaluation.js')).default},

        // set up ax program evaluation handler
        'workspace/do/get/dspy/evaluation': axAIUnit({url, createChatCompletion}),

        ...await importUnits(import.meta.url, [
            'workspace/do/get/dspy/evaluation/tests/simple.js',
        ]),
    }
}
