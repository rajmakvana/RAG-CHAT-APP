
export function getAvatar() {
    const random = Math.floor(Math.random() * 50) + 1;
    return { url: `https://avatar.iran.liara.run/public/${random}` };
}