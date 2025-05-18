export function haptics(controller, type){
    if (controller && controller.components && controller.components.haptics) {
        if (type == "block") {
            controller.components.haptics.pulse(1, 100);
            setTimeout(() => {
                    controller.components.haptics.pulse(1, 100);
            }, 200);
        } else if(type == "click") {
            controller.components.haptics.pulse(2, 200);
        } else if (type == 'newObjective') {
            controller.components.haptics.pulse(0.5, 50);
            setTimeout(() => {
                controller.components.haptics.pulse(1, 500);
            }, 100)
        } else if (type == 'objectiveFinished') {
            controller.components.haptics.pulse(1, 1000);
        } else if (type == 'hover') {
            controller.components.haptics.pulse(0.5, 50);
        }
    }
};