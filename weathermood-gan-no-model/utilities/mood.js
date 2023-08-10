export function getMoodIcon(group) {
    switch (group) {
        case 'Happy':
            return 'fas fa-smile';
        case 'Sad':
            return 'fa fa-sad-tear';
        case 'Fear':
            return 'fas fa-grimace'
        default:
            return 'fa fa-question-circle';
    }
}

export function getMoodUrl(group) {
    console.log(group);

    switch (group) {
        // TODO: Set preset pictures. [Ex:./images/faces/(PictureName).(png/.jpg)]
        case "Happy":
            return './faces/sad.png';
        case "Sad":
            return './faces/sad.png';
        case "Fearful":
            return './faces/fear.png'
        default:
            return './faces/sad.png';
    }
}