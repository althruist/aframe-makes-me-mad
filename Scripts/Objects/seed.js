import { setObjective } from "../Utils/objectives.js";

let count = 0;

export async function handle(object) {
    count++;
    object.parentElement.setAttribute('marker', false);

    object.remove();
    setObjective(`Collect Seeds: ${count}/7`, true);

    if (count === 7) {
        const treeForest = await import('../Cutscene/treeForest.js');
        await treeForest.handle();
    }
}