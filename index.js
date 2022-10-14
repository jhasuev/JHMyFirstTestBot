const TelegramApi = require('node-telegram-bot-api')

const gameOptions = require('./options')
const commands = require('./commands')

const token = '5667988766:AAEpeYwmobC0o2og1gmdHwC3eRbNzHM6moc'

const bot = new TelegramApi(token, { polling: true })

bot.setMyCommands(commands)

const chats = {}

const gameStart = (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  return bot.sendMessage(chatId, 'Я загадал число от 0 до 10, отгадай!', gameOptions.numbers)
}

bot.on('message', async (msg) => {
  console.log('msg', msg);
  const text = msg.text
  const chatId = msg.chat.id

  switch (text) {
    case '/start':
      await bot.sendMessage(chatId, 'Welcome to the bot!')
      break;
    case '/info':
      await bot.sendMessage(chatId, 'This is an info of the bot')
      break;
    case '/delay_msg':
      await bot.sendMessage(chatId, 'Delay message START')
      await new Promise((res) => setTimeout(res, 2000))
      await bot.sendMessage(chatId, 'Delay message END')
      break;
    case '/game':
      await gameStart(chatId)
      break;
  
    default:
      await bot.sendMessage(chatId, `I dont understand the content: ${text}`)
      break;
  }
})

bot.on('callback_query', async (msg) => {
  console.log('msg', msg);
  const text = msg.data
  const number = +msg.data
  const chatId = msg.message.chat.id

  if (!Number.isInteger(number)) {
    switch (text) {
      case 'again':
        await gameStart(chatId)
        break;
    
      default:
        await bot.sendMessage(chatId, `I dont understand the content: ${text}`)
        break;
    }

    return null
  }

  console.log('chats[chatId]', chats[chatId]);

  if (chats[chatId] === undefined) {
    await bot.sendMessage(chatId, 'игра не запущена...')
  } else if (chats[chatId] === number) {
    await bot.sendMessage(chatId, `Вы отгадали число`, gameOptions.playAgain)
  } else {
    await bot.sendMessage(chatId, chats[chatId] < number ? 'больше' : 'меньше', gameOptions.numbers)
  }

  return null
})