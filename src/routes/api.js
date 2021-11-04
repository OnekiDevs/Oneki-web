// noinspection JSUnresolvedVariable

const { Router } = require('express');
const router = Router();

module.exports = router;

//POLL
router.use('/poll', require('./api/poll'))

//WEBHOOK
router.use('/webhook', require('./api/webhook'))

//discord
router.use('/discord', require('./api/discord'));

//lang
router.use('/lang', require('./api/lang'));

//moderation
router.use('/moderation', require('./api/moderation'))

//fakeDiscordMessage
router.get("/fakeDiscordMessage", async (req, res) => {
    // console.log(req.query);
    let text = (req.query.text ?? "");
    if (req.query.mentions) for (const match of text.match(/&#60;@!?\d{17,19}&#62;/g)??[]) text = text.replace(match, userMention(JSON.parse(req.query.mentions)[match.match(/\d{17,19}/g)[0]]));
    if (req.query.roles) for (const match of text.match(/&#60;@&\d{17,19}&#62;/g)??[]) text = text.replace(match, rolesMention(JSON.parse(req.query.roles)[match.match(/\d{17,19}/g)[0]]));
    res.render('fakeDiscordMessage', {
        layout: false,
        UserColor: req.query.color ? `#${req.query.color}` : "#b9bbbe",
        AvatarUrl: req.query.avatar ?? `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random()*6)}.png`,
        UserName: req.query.user ?? "user",
        Text: text,
        Bot: req.query.bot === '1',
        Verified: req.query.verified === '1' && req.query.bot === '1',
        Time: `hoy a las ${format24(new Date().getHours())}:${format24(new Date().getMinutes())}`
    });
});

/**
 * cambia a formato de 24 horas
 * @param hour
 */
function format24(hour) {
    let s = hour.toString()
    if (s.length === 1) {
        return `0${s}`;
    } else {
        return hour;
    }
}

/**
 * crea un tag de usuario
 * @param user: string
 */
function userMention(user) {
    return `<span class="mention wrapper-3WhCwL mention interactive">@${user}</span>`
}

function rolesMention(role) {
    return `<span class="roleMention-2Bj0ju desaturate-qhyunI wrapper-3WhCwL mention">@${role}</span>`
}