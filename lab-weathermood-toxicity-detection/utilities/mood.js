/**
 * Return different emojis which represent three types of mood respectively
 * @param  {String} group The mood (Happy/Sad/Fear)
 * @return {String}       The icon
 */
export function getMoodIcon(group) {
    // console.log(group);
    // more icons can be found at https://fontawesome.com/icons

    switch (group) {
        case 'happy':
            return "fa-regular fa-face-smile";
        case 'sad':
            return "fa-solid fa-face-sad-tear";
        case 'fear':
            return "fas fa-grimace";
        default:
            return 'fa fa-fish';
    }
}
