import { boriseSay } from "../Utils/boriseTalk.js";
import { finishObjective } from "../Utils/objectives.js";
import { setMusic, setVolume, stopAmbience } from "../Utils/sound.js";
import { setTooltip, tooltipVisibility } from "../Utils/tooltip.js";

const borise = document.getElementById("borise");
const camera = document.getElementById("camera");
const hexagonWalls = document.getElementById("hexagon-walls");
const rightHand = document.getElementById("right-hand");
const walls = document.getElementById("hexagon-walls");
const fogcontroller = document.getElementById("fogcontroller");
const sky = document.getElementById("mcast-sky");
const tv = document.getElementById("tv");

const smallDetails = document.getElementById("detailstext");
const prospects = document.getElementById("prospectstext");
const description = document.getElementById("desctext");
const entry = document.getElementById("entrytext");

const buttons = ['button1', 'button2', 'button3', 'button4', 'button5', 'button6'];

let selected = false;
let listenersRegistered = false;
let decisionEnabled = true;
let currentButton = null;

const dialogueMap = {
    button1: "Ah! A tinkerer! Do you enjoy connecting devices, fixing problems, and ruling over servers and routers?",
    button2: "Code warrior, eh? Do you dream of making websites, mobile apps or automating life with your scripts?",
    button3: "Cyber hero detected! Do you want to test systems, outsmart hackers, and defend the digital realm?",
    button4: "Designer brain engaged! Do you love mixing tech with art? Animations, web design, cool interfaces?",
    button5: "A game maker! Do you want to create worlds, characters and game logic that players love?",
    button6: "Data detective! Do you like digging through numbers to find patterns and make predictions?"
};

const positionMap = {
    button1: { rot: "0 230 0", pos: "3964 0 -1.5" },
    button2: { rot: "0 45 0", pos: "4036 0 1.5" },
    button3: { rot: "0 -71.25 0", pos: "3980 0 29" },
    button4: { rot: "0 107 0", pos: "4019 0 -30.5" },
    button5: { rot: "0 180 0", pos: "3984 0 -32" },
    button6: { rot: "0 -8.64 0", pos: "4017 0 31.217" }
};

const configs = {
    button1: {
        fog: "#f399ae", sky: "Networking", tvFrom: "3960.605 2.719 0", tvTo: "3964.26954 2.719 0",
        desc: "#comsysnet-desc-image", entry: "#comsysnet-entry-image", prospect: "#comsysnet-prospectus-image", detail: "#comsysnet-details-image"
    },
    button2: {
        fog: "#2e1726", sky: "SoftwareDevelopment", tvFrom: "4039.566 2.719 0", tvTo: "4035.736 2.719 0",
        desc: "#softwaredev-desc-image", entry: "#softwaredev-entry-image", prospect: "#softwaredev-prospectus-image", detail: "#softwaredev-details-image"
    },
    button3: {
        fog: "#000000", sky: "CyberSecurity", tvFrom: "3979.881 2.719 33.933", tvTo: "3982.130 2.719 30.037",
        desc: "#cybersecurity-desc-image", entry: "#cybersecurity-entry-image", prospect: "#cybersecurity-prospectus-image", detail: "#cybersecurity-details-image"
    },
    button4: {
        fog: "#8e3d6a", sky: "CreativeComputing", tvFrom: "4019.531 2.719 -34.743", tvTo: "4017.530 2.719 -31.277",
        desc: "#creativecomputing-desc-image", entry: "#creativecomputing-entry-image", prospect: "#creativecomputing-prospectus-image", detail: "#creativecomputing-details-image"
    },
    button5: {
        fog: "#72a3da", sky: "GameDesign", tvFrom: "3981.003 2.719 -34.664", tvTo: "3983.140 2.719 -30.964",
        desc: "#digitalgames-desc-image", entry: "#digitalgames-entry-image", prospect: "#digitalgames-prospectus-image", detail: "#digitalgames-details-image"
    },
    button6: {
        fog: "#d6e0a3", sky: "Data", tvFrom: "4020.468 2.719 33.693", tvTo: "4018.403 2.719 30.116",
        desc: "#applieddata-desc-image", entry: "#applieddata-entry-image", prospect: "#applieddata-prospectus-image", detail: "#applieddata-details-image"
    }
};

export function handle(button) {
    decisionEnabled = true;
    currentButton = button;
    button.setAttribute("disabled", true);
    button.setAttribute('animation-mixer', 'clip: Push; loop: once;');

    borise.removeAttribute("borise");
    camera.setAttribute("walk", false);

    setTimeout(() => {
        const prompt = scene.is("vr-mode") ? "Press 'B' for Yeah!, 'A' for Nah..." : "Press 'Y' for Yeah!, 'N' for Nah...";
        setTooltip(prompt, false);
    }, 1000);

    const { rot, pos } = positionMap[button.id] || {};
    if (rot && pos) {
        borise.setAttribute("rotation", rot);
        borise.setAttribute("position", pos);
        boriseSay(dialogueMap[button.id]);
    }

    if (!listenersRegistered) {
        listenersRegistered = true;

        window.addEventListener('keydown', (e) => {
            if (e.key === 'y') onDecision(true, currentButton);
            else if (e.key === 'n') onDecision(false, currentButton);
        });

        rightHand.addEventListener('bbuttondown', () => onDecision(true, currentButton));
        rightHand.addEventListener('abuttondown', () => onDecision(false, currentButton));
    }
}

function onDecision(decision, button) {
    if (!button || selected || !decisionEnabled) return;

    tooltipVisibility(false);

    if (decision === true) {
        selected = true;
        button.removeAttribute('animation-mixer');
        tv.components.sound.playSound();

        // Environment changes
        walls.setAttribute('animation-mixer', 'clip: Despawn; loop: once;');
        walls.addEventListener('animation-finished', () => walls.remove());

        sky.setAttribute('animation', 'property: rotation; to: 0 360 0; dur: 60000; loop: true;');
        sky.setAttribute('animation__1', 'property: opacity; to: 1; dur: 5000;');
        hexagonWalls.setAttribute('animation', 'property: position; to: 4000 -100 0; easing: easeInOutSine; dur: 5000;');

        boriseSay("Good choice!");
        boriseSay("Bleep bloop! I found you something you might like! Take a look at your chosen degree!");
        boriseSay("Explore projects, meet your future self, and see what epic quests await!");
        boriseSay("Go see the projects in the Institute of ICT (Opposite Block! See you Around)!");
        boriseSay("Feel free to refresh this game if you want to restart this scene OR play the full experience in the forest.");

        const conf = configs[button.id];
        if (!conf) return;

        // Apply visuals
        finishObjective();
        setVolume("ambience", 0);
        stopAmbience();
        setMusic("#voyage-music", 0.3, true);
        fogcontroller.setAttribute("fog-controller", "color", conf.fog);
        sky.setAttribute('material', `src: Images/Skies/${conf.sky}.webp; fog: false;`);

        const buttonRot = button.getAttribute('rotation') || "0 0 0";
        tv.setAttribute('rotation', buttonRot);
        tv.setAttribute('position', conf.tvFrom);
        tv.setAttribute('animation', `property: position; from: ${conf.tvFrom}; to: ${conf.tvTo}; easing: easeOutSine; dur: 5000;`);

        description.setAttribute('material', `src: ${conf.desc}`);
        entry.setAttribute('material', `src: ${conf.entry}`);
        prospects.setAttribute('material', `src: ${conf.prospect}`);
        smallDetails.setAttribute('material', `src: ${conf.detail}`);

        // Hide all buttons with animation
        buttons.forEach((id, index) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            const pos = btn.getAttribute('position');
            if (!pos) return;

            const newY = -10;
            const newPos = `${pos.x}, ${newY}, ${pos.z}`;
            btn.setAttribute('animation', `property: position; to: ${newPos}; dur: 3000; easing: easeOutCirc;`);
            btn.addEventListener('animationcomplete', () => btn.remove());
        });

    } else {
        // Decline choice
        decisionEnabled = false;
        borise.setAttribute('borise', 'distance: 4; followSpeed: 0.08; height: 0.5; rotationSpeed: 90;');
        boriseSay("Beaap! Okay! Let's continue looking. Following undecided recruit again.", true);
        button.removeAttribute("disabled");
        button.setAttribute("marker", true);
    }
}
