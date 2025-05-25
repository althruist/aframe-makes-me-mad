import { finishObjective } from "../Utils/objectives.js";

export async function handle(object) {
    object.setAttribute('marker', false);
    object.remove();
    finishObjective();
    const treeForest = await import('../Cutscene/rainForest.js');
    await treeForest.handle();
}