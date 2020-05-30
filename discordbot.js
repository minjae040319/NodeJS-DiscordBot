const discord = require("discord.js");
const client = new discord.Client();
const fs = require("fs");

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	if(!msg.guild)
		return;
	if(msg.content.toLowerCase().startsWith("/경고")){
		console.log(msg.content.toLowerCase().split(" "));
		[command, name, count, reason] = msg.content.toLowerCase().split(" "); //명령어, 닉네임, 갯수, 사유: 공백을 기준으로 쪼개서 각각의 요소들에 저장
		if(!name){
			msg.reply("사용법: `/경고 <닉네임> <갯수> <사유>`");
			return;
		}
		if(!count)
			count = 1;
		if(!isNumber(count)){
			msg.reply("경고 갯수는 정수여야 합니다.");
		}
		if(!reason)
			reason = "관리자 재량";

		msg.reply(name + "님께 `" + reason + "`의 사유로 경고 " + count + "개가 부여됐습니다.");
		addWarn(msg.content.guild, name, count)
		if(getWarn(msg.content.guild, name) >= 5){
			msg.content.guild.members[name].kick("경고 누적으로 서버에서 추방되었습니다.");
		}
	}
});

function addWarn(guild, name, count){
	if(!fs.existsSync("warnData.json")){
		content = {};
	}else{
		content = JSON.parse(fs.readFileSync("warnData.json").toString());
	}
	if(!content[guild.name])
		content[guild.name] = {};
	if(!content[guild.name][name])
		content[guild.name][name] = 0;
	content[guild.name][name] += count;
	fs.writeFileSync("warnData.json", JSON.stringify(content));
}

/**
 * @param guild
 * @param name
 * @return int
 */
function getWarn(guild, name){
	content = JSON.parse(fs.readFileSync("warnData.json").toString());
	if(!content[guild.name])
		return -1;
	if(!content[guild.name][name])
		return -1;
	return content[guild.name][name];
}



client.login('NzEwNjU0NDA1MzkyODU5MjI3.Xr3mqA.rPNuW7l2MAKZOVgQrrvHEJkqUBY');

function isNumber(str){
	var string = str + ''; // 문자열로 변환
	var string = string.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
	if(string === '' || isNaN(string)) return false;
	return true;
}