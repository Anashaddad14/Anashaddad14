
const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType, WebhookClient } = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const ms = require('ms'); // نحن بحاجة 

function initializeBot(token, clientId) {
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
const premiumFile = 'premium.json';
const TOKENS = ['MTI3MzY5NzM1NTk4MzYxODA0OA.GnwJbJ.dZQAL9ar3tW7kPaNvEIwU78F-G3PaJXJLC6XQw', 'MTI3Mjk2NDg1NDk1MjYyNDE0OQ.GA_S3y.CQFkPXD6y3_dXRhEGSWZUy3eHWpQfQtGX_KL8g']; // أضف هنا التوكنات الخاصة بكل بوت
const CLIENT_IDS = ['1273697355983618048', '1272964854952624149']; // أضف هنا معرفات العملاء لكل بوت



const INVITE_LINK = 'https://discord.com/oauth2/authorize?client_id=1272964854952624149'; // ضع رابط invite الخاص بك هنا

const COMMANDS_LINK = 'https://discord.com/invite/tHkhTzMf'; // ضع رابط commands الخاص بك هنا

const SUPPORT_LINK = 'https://discord.com/invite/w7YSY46t'; // ضع رابط support 

const DATA_FILE = path.join(__dirname, 'data.json');

let serverData = {};

// وظيفة لتحميل البيانات من الملف
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    const rawData = fs.readFileSync(DATA_FILE);
    serverData = JSON.parse(rawData);
  }
}

// وظيفة لحفظ البيانات في الملف
function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(serverData, null, 2));
}




    

   
client.on('ready', () => { // Listen for the 'ready' event

 client.once('ready', async () => {
   console.log(`Logged in as ${client.user.tag}`);
   loadData();
   await initializeCommands(token, clientId);
 

    

  client.user.setPresence({ // Now set the presence after login

    activities: [{ name: 'by Dark and Ahmed' }], 

    status: 'online' 

  });

});



  





function formatDate(timestamp) {
    const now = moment();
    const then = moment(timestamp);
    const yearsDiff = now.diff(then, 'years');
    const monthsDiff = now.diff(then, 'months');
    const daysDiff = now.diff(then, 'days');

    if (yearsDiff > 0) {
        return `${yearsDiff} year${yearsDiff > 1 ? 's' : ''} ago`;
    } else if (monthsDiff > 0) {
        return `${monthsDiff} month${monthsDiff > 1 ? 's' : ''} ago`;
    } else {
        return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    const guildId = interaction.guild.id;

    if (commandName === 'line_add') {
        const imageUrl = options.getString('url');
        if (!serverData[guildId]) {
            serverData[guildId] = {};
        }
        serverData[guildId].imageUrl = imageUrl;
        await interaction.reply('تم إضافة رابط الصورة بنجاح.');
        saveData();
        return;
    }

if (commandName === 'line_role') {
        const role = options.getRole('role');
        if (role) {
            if (!serverData[guildId]) {
                serverData[guildId] = {};
            }
            serverData[guildId].roleId = role.id;
            await interaction.reply(`تم تعيين الرتبة بنجاح: ${role.name}`);
            saveData();
        } else {
            await interaction.reply('الرجاء تقديم اسم أو معرف رتبة صالح.');
            }
    return;
    }
           


        
        
    

    if (commandName === 'user') {
        const user = options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => `<@&${role.id}>`).join(', ');

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`معلومات المستخدم: ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields([
                { name: 'الاسم الكامل:', value: user.tag, inline: true },
                { name: 'المعرف:', value: user.id, inline: true },
                { name: 'تاريخ الإنضمام للديسكورد:', value: formatDate(user.createdTimestamp), inline: true },
                { name: 'تاريخ الإنضمام للسيرفر:', value: formatDate(member.joinedTimestamp), inline: true },
                { name: 'الرتب:', value: roles || 'لا توجد رتب', inline: true },
            ])
            .setFooter({ text: `طلب عن طريق: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        return;
    }

    if (commandName === 'server') {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`معلومات السيرفر: ${guild.name}`)
.setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields([
                { name: 'الاسم:', value: guild.name, inline: true },
                { name: 'المعرف:', value: guild.id, inline: true },
                { name: 'المالك:', value: owner.user.tag, inline: true },
                { name: 'تاريخ الإنشاء:', value: formatDate(guild.createdTimestamp), inline: true },
                { name: 'عدد الأعضاء:', value: `${guild.memberCount}`, inline: true },
            ])
            .setFooter({ text: `طلب عن طريق: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        return;
    }

    if (commandName === 'server_banner') {
        const bannerURL = interaction.guild.bannerURL({ size: 1024 });
        await interaction.reply(bannerURL ? { files: [{ attachment: bannerURL }] } : 'هذا السيرفر ليس لديه بانر.');
        return;
    }

    if (commandName === 'server_avatar') {
        const iconURL = interaction.guild.iconURL({ size: 1024 });
        await interaction.reply(iconURL ? { files: [{ attachment: iconURL }] } : 'هذا السيرفر ليس لديه أيقونة.');
        return;
    }

    if (commandName === 'avatar') {
        const user = options.getUser('user') || interaction.user;
        await interaction.reply({ files: [{ attachment: user.displayAvatarURL({ dynamic: true, size: 1024 }) }] });
        return;
    }

    if (commandName === 'banner') {
        const user = options.getUser('user') || interaction.user;
        const userBanner = await client.users.fetch(user.id, { force: true }).then(u => u.bannerURL({ size: 1024 }));

        await interaction.reply(userBanner ? { files: [{ attachment: userBanner }] } : 'هذا المستخدم ليس لديه بانر.');
        return;
    }

 if (commandName === 'add') {
    const emojiInput = options.getString('emoji');
    const guild = interaction.guild;

    // التأكد من أن المستخدم لديه صلاحيات تعديل الرتب
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        await interaction.reply({ content: 'ليس لديك صلاحية لإدارة الرتب.', ephemeral: true });
        return;
    }

    try {
        let emojiURL;
        let emojiName;

        // تحقق مما إذا كان الإدخال هو معرف إيموجي أو اسم إيموجي
        if (/^\d+$/.test(emojiInput)) {
            // إذا كان الإدخال معرف إيموجي
            const emoji = await client.emojis.fetch(emojiInput);
            if (emoji) {
                emojiURL = emoji.url;
                emojiName = emoji.name;
            }
        } else {
            // إذا كان الإدخال هو اسم إيموجي
            const emoji = guild.emojis.cache.find(e => e.name === emojiInput);
            if (emoji) {
                emojiURL = emoji.url;
                emojiName = emoji.name;
            }
            // إذا لم يتم العثور على الإيموجي في الكاش، نحاول أن نرسله كإيموجي خارجي
            else {
                const match = emojiInput.match(/<:\w+:(\d+)>/);
                if (match) {
                    const emoji = await client.emojis.fetch(match[1]);
                    emojiURL = emoji.url;
                    emojiName = emojiInput.split(':')[1];
                }
            }
        }

        if (!emojiURL || !emojiName) {
            await interaction.reply({ content: 'لم يتم العثور على الإيموجي.', ephemeral: true });
            return;
        }

        // إضافة الإيموجي إلى السيرفر
        const newEmoji = await guild.emojis.create({
            attachment: emojiURL,
            name: emojiName,
        });

        await interaction.reply({ content: `تم إضافة الإيموجي بنجاح: ${newEmoji.toString()}`, ephemeral: false });
    } catch (error) {
        console.error(error);
await interaction.reply({ content: 'حدث خطأ أثناء إضافة الإيموجي.', ephemeral: true });
    }
    return;
}
  
          
        // إضافة الإيموجي إلى السيرفر
       
  
   
    if (commandName === 'blacklist') {
        const userId = options.getUser('user').id;
        if (!serverData.blacklist) {
            serverData.blacklist = [];
        }
        if (!serverData.blacklist.includes(userId)) {
            serverData.blacklist.push(userId);
            saveData();
            await interaction.reply('تم إضافة المستخدم إلى القائمة السوداء.');
        } else {
            await interaction.reply('المستخدم موجود بالفعل في القائمة السوداء.');
        }
        return;
    }

      if (interaction.commandName === 'help') {
        const guildCount = client.guilds.cache.size;
        const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('ProBank')

            .setDescription('ProBank هو بوت ديسكورد الخاص بك، والذي يتميز بنظام قوي وإدارة التذاكر ونظام توزيع الهدايا وأوامر الموسيقى وملفات تعريف المستخدم والتخصيص الكامل للخادم والمزيد...')
            .addFields(
                { name: 'Commands', value: '26', inline: true },
                { name: 'Servers', value: `${guildCount}`, inline: true },
                 { name: 'المطورين', value: '<@317250003062226944> | <@1231643650425880589>'},
                { name: 'Users', value: `${userCount}`, inline: true }
            )
          .setImage("https://cdn.discordapp.com/attachments/1272160184277667871/1273023421680324649/Picsart_24-08-13_13-51-22-385.jpg?ex=66bd1af3&is=66bbc973&hm=a6384f92aa960badfd9d56ce5dd34e1c8d50e81a8854d1b91a1eebbadda51896&");

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Invite')
                    .setURL(INVITE_LINK)
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('Commands')
                    .setURL(COMMANDS_LINK)
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('Support')
                    .setURL(SUPPORT_LINK)
                    .setStyle(ButtonStyle.Link)
            );
        
        await interaction.reply({ embeds: [embed], components: [row] });
    }

 if (commandName === 'clear') {
const number = options.getInteger('number');

// تحقق من وجود الصلاحيات
if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
return interaction.reply({ content: 'أنت لا تملك الصلاحيات لمسح الرسائل.', ephemeral: true });
}

// تحقق من أن العدد أكبر من 0 وأقل من أو يساوي 100
if (number <= 0 || number > 100) {
return interaction.reply({ content: 'يرجى إدخال عدد صحيح بين 1 و 100.', ephemeral: true });
}

// مسح الرسائل
interaction.channel.bulkDelete(number, true)
.then(deletedMessages => {
interaction.reply({ content: `تم مسح ${deletedMessages.size} رسالة.` })
.then(msg => {
setTimeout(() => msg.delete(), 5000); // حذف الرسالة بعد 5 ثواني
});
})
.catch(error => {
console.error(error);
interaction.reply({ content: 'حدث خطأ أثناء محاولة مسح الرسائل.', ephemeral: true });
});
}
        

        

  if (commandName === 'ban') {
    const user = options.getUser('user');
    const reason = options.getString('reason') || 'No reason provided';

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'أنت لا تملك الصلاحيات لحظر الأعضاء.', ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({ content: 'لم يتم العثور على العضو.', ephemeral: true });
    }

    member.ban({ reason })
      .then(() => interaction.reply({ content: `تم حظر ${user.tag} بنجاح.` }))
      .catch(error => {
        console.error(error);
        interaction.reply({ content: 'حدث خطأ أثناء محاولة حظر العضو.', ephemeral: true });
      });
  }

  if (commandName === 'unban') {
    const userId = options.getString('userid');

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'أنت لا تملك الصلاحيات لفك حظر الأعضاء.', ephemeral: true });
    }

    interaction.guild.members.unban(userId)
      .then(user => interaction.reply({ content: `تم فك حظر ${user.tag} بنجاح.` }))
      .catch(error => {
        console.error(error);
        interaction.reply({ content: 'حدث خطأ أثناء محاولة فك حظر العضو.', ephemeral: true });
      });
  }

  if (commandName === 'lock') {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'أنت لا تملك الصلاحيات لقفل الرومات.', ephemeral: true });
    }

    interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false })
      .then(() => interaction.reply({ content: 'تم قفل الروم بنجاح.' }))
      .catch(error => {
        console.error(error);
        interaction.reply({ content: 'حدث خطأ أثناء محاولة قفل الروم.', ephemeral: true });
      });
  }

  if (commandName === 'unlock') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'أنت لا تملك الصلاحيات لفتح الرومات.', ephemeral: true });
    }

    interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true })
      .then(() => interaction.reply({ content: 'تم فتح الروم بنجاح.' }))
      .catch(error => {
        console.error(error);
        interaction.reply({ content: 'حدث خطأ أثناء محاولة فتح الروم.', ephemeral: true });
      });
  }

 if (commandName === 'premium') {
const user = options.getUser('user');
const guild = options.getString('guild');
const premiumData = JSON.parse(fs.readFileSync(premiumFile, 'utf-8') || '{}');

if (!premiumData[guild]) premiumData[guild] = [];
premiumData[guild].push(user.id);

fs.writeFileSync(premiumFile, JSON.stringify(premiumData, null, 2));
const channel = interaction.guild.channels.cache.find(ch => ch.type === 'GUILD_TEXT');
if (channel) {
channel.createWebhook('My Webhook', {
avatar: client.user.displayAvatarURL(),
})
.then(webhook => {
premiumData[guild].webhookId = webhook.id;
premiumData[guild].webhookToken = webhook.token;
fs.writeFileSync(premiumFile, JSON.stringify(premiumData, null, 2));
interaction.reply(`تم تسجيل ${user.username} كمميز في السيرفر ${guild}.`);
})
.catch(console.error);
}
}

if (commandName === 'bot-avatar') {
const avatar = options.getString('avatar');
const guild = interaction.guild.id;
const premiumData = JSON.parse(fs.readFileSync(premiumFile, 'utf-8') || '{}');

if (premiumData[guild] && premiumData[guild].webhookId && premiumData[guild].webhookToken) {
const webhook = new WebhookClient({ id: premiumData[guild].webhookId, token: premiumData[guild].webhookToken });
webhook.edit({ avatar })
.then(() => interaction.reply('تم تغيير صورة ويب هوك بنجاح.'))
.catch(error => {
console.error(error);
interaction.reply('حدث خطأ أثناء تغيير صورة ويب هوك.');
});
} else {
interaction.reply('لم يتم العثور على ويب هوك لهذا السيرفر.');
}
}

if (commandName === 'bot-name') {
const name = options.getString('name');
const guild = interaction.guild.id;
const premiumData = JSON.parse(fs.readFileSync(premiumFile, 'utf-8') || '{}');

if (premiumData[guild] && premiumData[guild].webhookId && premiumData[guild].webhookToken) {
const webhook = new WebhookClient({ id: premiumData[guild].webhookId, token: premiumData[guild].webhookToken });
webhook.edit({ name })
.then(() => interaction.reply('تم تغيير اسم ويب هوك بنجاح.'))
.catch(error => {
console.error(error);
interaction.reply('حدث خطأ أثناء تغيير اسم ويب هوك.');
});
} else {
interaction.reply('لم يتم العثور على ويب هوك لهذا السيرفر.');
}
}
if (commandName === 'mute') {
      
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'يجب أن تكون لديك صلاحيات الـAdmin لاستخدام هذا الأمر.', ephemeral: true });
    }

const user = options.getUser('user');
const time = options.getString('time');
const member = interaction.guild.members.cache.get(user.id);
if (member) {
const duration = ms(time);
member.timeout(duration, 'Muted by command')
.then(() => interaction.reply(`${user.username} تم تصميته لمدة ${time}.`))
.catch(error => {
console.error(error);
interaction.reply('حدث خطأ أثناء محاولة تصميت المستخدم.');
});
} else {
interaction.reply('لم يتم العثور على المستخدم المحدد في السيرفر.');
}
} else if (commandName === 'unmute') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'يجب أن تكون لديك صلاحيات الـAdmin لاستخدام هذا الأمر.', ephemeral: true });
    }
const user = options.getUser('user');
const member = interaction.guild.members.cache.get(user.id);
if (member) {
member.timeout(null, 'Unmuted by command')
.then(() => interaction.reply(`${user.username} تم فك التصميت عنه.`))
.catch(error => {
console.error(error);
interaction.reply('حدث خطأ أثناء محاولة فك التصميت عن المستخدم.');
});
} else {
interaction.reply('لم يتم العثور على المستخدم المحدد في السيرفر.');
}
} else if (commandName === 'timeout') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

      return interaction.reply({ content: 'يجب أن تكون لديك صلاحيات الـAdmin لاستخدام هذا الأمر.', ephemeral: true });

    }
const user = options.getUser('user');
const member = interaction.guild.members.cache.get(user.id);
if (member) {
const duration = ms(time);
member.timeout(duration, 'Timed out by command')
.then(() => interaction.reply(`${user.username} تم توقيته لمدة ${time}.`))
.catch(error => {
console.error(error);
interaction.reply('حدث خطأ أثناء محاولة توقيت المستخدم.');
});
} else {
interaction.reply('لم يتم العثور على المستخدم المحدد في السيرفر.');
}
} else if (commandName === 'untimeout') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'يجب أن تكون لديك صلاحيات الـAdmin لاستخدام هذا الأمر.', ephemeral: true });
    }
const user = options.getUser('user');
const member = interaction.guild.members.cache.get(user.id);
if (member) {
member.timeout(null, 'Untimed out by command')
.then(() => interaction.reply(`${user.username} تم فك التوقيت عنه.`))
.catch(error => {
console.error(error);
interaction.reply('حدث خطأ أثناء محاولة فك التوقيت عن المستخدم.');
});
} else {
interaction.reply('لم يتم العثور على المستخدم المحدد في السيرفر.');
}
} else if (commandName === 'rar') {
if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'يجب أن تكون لديك صلاحيات الـAdmin لاستخدام هذا الأمر.', ephemeral: true });
    }
const user = options.getUser('user');
const member = interaction.guild.members.cache.get(user.id);
if (member) {
const rolesToRemove = member.roles.cache.filter(role => role.name !== '<@redacted>');
member.roles.remove(rolesToRemove)
.then(() => interaction.reply(`تمت إزالة جميع الرولات من ${user.username}.`))
.catch(error => {
console.error(error);
interaction.reply('حدث خطأ أثناء محاولة إزالة الرولات من المستخدم.');
});
} else {
interaction.reply('لم يتم العثور على المستخدم المحدد في السيرفر.');
}
}

if (commandName === 'role_icon') {
    const role = options.getRole('role');
    const emoji = options.getString('emoji');

    if (role) {
      try {
        await role.setIcon(emoji);
        await interaction.reply(`تم تعيين الأيقونة للرول ${role.name} بنجاح.`);
      } catch (error) {
        console.error(error);
        await interaction.reply('حدث خطأ أثناء تعيين الأيقونة للرول. تأكد أن الأيقونة صالحة وأن البوت لديه الصلاحيات المطلوبة.');
      }
    } else {
      await interaction.reply('لم يتم العثور على الرول المحدد.');
    }
  }



    
          
    

    

        if (commandName === 'role-add') {
        const user = options.getUser('user');
        const role = options.getRole('role');
        const action = options.getString('action');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: `User not found in this server.`, ephemeral: true });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: `You don't have permissions to manage roles.`, ephemeral: true });
        }

        try {
            if (action === 'add') {
                await member.roles.add(role);
                interaction.reply(`Added the role <@&${role.id}> to <@${user.id}>.`);
            } else if (action === 'remove') {
                await member.roles.remove(role);
                interaction.reply(`Removed the role <@&${role.id}> from <@${user.id}>.`);
            }
        } catch (error) {
            console.error(error);
            interaction.reply(`Failed to ${action} the role.`);
        }
    }

    if (commandName === 'role-multiple') {
        const role = options.getRole('role');
        const target = options.getString('target');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: `You don't have permissions to manage roles.`, ephemeral: true });
        }

        try {
            let members;
            if (target === 'humans') {
                members = interaction.guild.members.cache.filter(member => !member.user.bot);
            } else if (target === 'bots') {
                members = interaction.guild.members.cache.filter(member => member.user.bot);
            } else if (target === 'all') {
                members = interaction.guild.members.cache;
            }

            if (role) {
                members.forEach(member => {
                    member.roles.add(role).catch(console.error);
                });

                interaction.reply(`Added the role <@&${role.id}> to ${target === 'all' ? 'all members' : target === 'humans' ? 'all humans' : 'all bots'}.`);
            } else {
                interaction.reply(`Role not found.`);
            }

        } catch (error) {
            console.error(error);
            interaction.reply(`Failed to add the role to ${target}.`);
        }
       
            }
       });
     

client.on('messageCreate', async message => {
if (!message.guild || message.author.bot) return;

const premiumData = JSON.parse(fs.readFileSync(premiumFile, 'utf-8') || '{}');

const guild = message.guild.id;

if (premiumData[guild] && message.content.startsWith('/')) {
const webhook = new WebhookClient({ id: premiumData[guild].webhookId, token: premiumData[guild].webhookToken });
webhook.send({
content: message.content,
avatarURL: botAvatar,
username: botName,
})
.then(() => console.log('تم إرسال الرسالة عبر الويب هوك.'))
.catch(error => console.error('حدث خطأ أثناء إرسال الرسالة عبر الويب هوك:', error));
}
    });
          
      


    


        
   





        

        






  
async function initializeCommands() {
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    const commands = [
        {
            name: 'line_add',
            description: 'إضافة رابط صورة',
            options: [
                {
                    name: 'url',
                    type: 3, // STRING
                    description: 'رابط الصورة',
                    required: true,
},
            ],
        },
        {
            name: 'line_role',
            description: 'تحديد رتبة',
            options: [
                {
                    name: 'role',
                    type: 8, // ROLE
                    description: 'الرتبة',
                    required: true,
                },
            ],
        },
        {
            name: 'user',
            description: 'عرض معلومات المستخدم',
            options: [
                {
                    name: 'user',
                    type: 6, // USER
                    description: 'المستخدم',
                    required: false,
                },
            ],
        },
        {
            name: 'server',
            description: 'عرض معلومات السيرفر',
        },
        {
            name: 'server_banner',
            description: 'عرض بانر السيرفر',
        },
        {
            name: 'server_avatar',
            description: 'عرض أيقونة السيرفر',
        },
        {
            name: 'avatar',
            description: 'عرض صورة الملف الشخصي',
            options: [
                {
                    name: 'user',
                    type: 6, // USER
                    description: 'المستخدم',
                    required: false,
                },
            ],
        },
        {
            name: 'banner',
            description: 'عرض بانر المستخدم',
            options: [
                {
                    name: 'user',
                    type: 6, // USER
                    description: 'المستخدم',
                    required: false,
                },
            ],
        },
         {
      name: 'add',
      description: 'إضافة إيموجي للسيرفر',
      options: [
        {
          name: 'emoji',
          type: 3, // STRING
          description: 'أيدي أو اسم الإيموجي',
          required: true,
        },
      ],
    },
   {
name: 'mute',
description: 'تصميت مستخدم لمدة معينة',
options: [
{
name: 'user',
type: 6, // USER
description: 'المستخدم',
required: true,
},
{
name: 'time',
type: 3, // STRING
description: 'مدة التصميت (مثال: 10m، 1h)',
required: true,
},
],
},
{
name: 'unmute',
description: 'فك التصميت عن مستخدم',
options: [
{
name: 'user',
type: 6, // USER
description: 'المستخدم',
required: true,
},
],
},
{
name: 'timeout',
description: 'تحديد مدة زمنية للمستخدم',
options: [
{
name: 'user',
type: 6, // USER
description: 'المستخدم',
required: true,
},
{
name: 'time',
type: 3, // STRING
description: 'مدة التوقيت (مثال: 10m، 1h)',
required: true,
},
],
},
{
name: 'untimeout',
description: 'فك مدة التوقيت عن المستخدم',
options: [
{
name: 'user',
type: 6, // USER
description: 'المستخدم',
required: true,
},
],
},
{
name: 'rar',
description: 'إزالة جميع الرولات من مستخدم',
options: [
{
name: 'user',
type: 6, // USER
description: 'المستخدم',
required: true,
},
],
},

        {
            name: 'blacklist',
            description: 'إضافة مستخدم إلى القائمة السوداء',
            options: [
                {
                    name: 'user',
                    type: 6, // USER
                    description: 'المستخدم',
                    required: true,
                },
            ],
        },
        {
        name: 'role-add',
        description: 'Add or remove a role from a user',
        options: [
            {
                type: 6, // USER type
                name: 'user',
                description: 'The user to modify the role for',
                required: true,
            },
            {
                type: 8, // ROLE type
                name: 'role',
                description: 'The role to add or remove',
                required: true,
            },
            {
                type: 3, // STRING type
                name: 'action',
                description: 'Add or remove the role',
                required: true,
                choices: [
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' }
                ]
            }
        ]
    },
    {
        name: 'role-multiple',
        description: 'Add a role to multiple users',
        options: [
            {
                type: 8, // ROLE type
                name: 'role',
                description: 'The role to add',
                required: true,
            },
            {
                type: 3, // STRING type
                name: 'target',
                description: 'Target type',
                required: true,
                choices: [
                    { name: 'Humans', value: 'humans' },
                    { name: 'Bots', value: 'bots' },
                    { name: 'All', value: 'all' }
                ]
            }
        ]
    },
            {
      name: 'ban',
      description: 'حظر مستخدم من السيرفر',
      options: [
        {
          name: 'user',
          type: 6, // USER
          description: 'المستخدم المراد حجبه',
          required: true,
        },
        {
          name: 'reason',
          type: 3, // STRING
          description: 'سبب الحظر',
          required: false,
        },
      ],
    },
    {
      name: 'unban',
      description: 'فك حظر مستخدم من السيرفر',
      options: [
        {
          name: 'userid',
          type: 3, // STRING
          description: 'معرف المستخدم المراد فك حجبه',
          required: true,
        },
      ],
    },
    {
      name: 'lock',
      description: 'قفل الروم',
    },
    {
      name: 'unlock',
      description: 'فتح الروم',
    },
  


    
  {
name: 'clear',
description: 'مسح عدد معين من الرسائل',
options: [
{
type: 4, // INTEGER type
name: 'number',
description: 'عدد الرسائل التي تريد مسحها',
required: true
}
]
},
{
name: 'premium',
description: 'تسجيل مستخدم مميز في سيرفر محدد.',
options: [
{
name: 'user',
type: 6, // USER
description: 'المستخدم',
required: true,
},
{
name: 'guild',
type: 3, // STRING
description: 'معرف السيرفر',
required: true,
}
]
},
{
name: 'bot-avatar',
description: 'تغيير صورة ويب هوك في السيرفر المحدد.',
options: [
{
name: 'avatar',
type: 3, // STRING
description: 'رابط صورة جديدة',
required: true,
}
]
},
{
name: 'bot-name',
description: 'تغيير اسم ويب هوك في السيرفر المحدد.',
options: [
{
name: 'name',
type: 3, // STRING
description: 'اسم جديد',
required: true,
}
]
},

    {
      name: 'role_icon',
      description: 'تعيين أيقونة لرول معين',
      options: [
        {
          name: 'role',
          type: 8, // ROLE
          description: 'الرول',
          required: true,
        },
        {
name: 'emoji',
          type: 3, // STRING
          description: 'الرمز التعبيري',
          required: true,
        }
      ]
    },




        {
            name: 'help',
            description: 'عرض قائمة الأوامر',
        },
    ];

    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
}

// تشغيل جميع البوتات
TOKENS.forEach((token, index) => {
 initializeBot(token, CLIENT_IDS[index]);

               });