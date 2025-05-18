import { setSubtitle } from '../Utils/subtitles.js';
import { say } from '../Utils/voicelines.js';
import { finishObjective } from '../Utils/objectives.js';

export async function handle(object) {
    finishObjective();
    console.log("Cube logic executed!");
    say('Test', '01');
    say('Test', '02');
    say('Test', '03');
    say('Test', '04');
    say('Test', '05');
    object.setAttribute('color', 'green');
    await setSubtitle("Hi, this is me testing out the voicelines feature", false, 3.5);
    await setSubtitle("which I'll be creating soon...", false, 2.5);
    await setSubtitle("and now, you'll be hearing my friends' voices", false, 2.5);
    await setSubtitle("that happily participated in whatever this is.", false, 5.5);
    object.setAttribute('color', 'blue');
    await setSubtitle("THE MOON...", false, 1.4);
    await setSubtitle("...HAUNTS YOU!", false, 2);
    object.setAttribute('color', 'red');
    await setSubtitle("The fitness gram pace", false, 2);
    await setSubtitle("is a multimedia", false, 2);
    object.setAttribute('color', 'yellow');
    await setSubtitle("Lorem ipsum is simply dummy text", false, 2);
    await setSubtitle("f-of-f", false, 1);
    await setSubtitle("of the printing", false, 0.5);
    // tree.setAttribute('animation-mixer', 'clip', 'Test');
    await setSubtitle("aand", false, 1);
    await setSubtitle("type setting industry", false, 2);
    object.setAttribute('color', 'black');
    await setSubtitle("*metal rod*", true, 2);
}