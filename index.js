const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { Telegraf } = require('telegraf')
const Telegram = require('telegraf/telegram')

const bot = new Telegraf("1305558612:AAGz4TlWpfaqWB0nG6VaDTRW1xAJsZ038KA")
const telegram = new Telegram("1305558612:AAGz4TlWpfaqWB0nG6VaDTRW1xAJsZ038KA")

// const searchURL= 'https://eshop-prices.com/games/378-the-legend-of-zelda-breath-of-the-wild?currency=BRL';
// const searchURL= 'https://eshop-prices.com/games/5218-hades?currency=BRL';

async function GetBestPrice(searchURL) {
  const response = await got(searchURL);
  const dom = new JSDOM(response.body);

  const item = dom.window.document.querySelector('td.price-value');
  console.log(item.innerHTML);
  let bestPrice = /(^|\s)R\$([^\n\r]*)/.exec(item.innerHTML)[2]
  console.log(bestPrice)
  bestPrice = bestPrice.replace(",",".")
  bestPrice = parseFloat(bestPrice)
  console.log(bestPrice)
  return bestPrice
}

bot.start((ctx) => {
    ctx.reply("Bem vindo!" + JSON.stringify(ctx.reply))
    ctx.reply("Digite '/watch' seguido de uma URL válida do site https://eshop-prices.com/, como por exemplo 'https://eshop-prices.com/games/5218-hades?currency=BRL'")
})

bot.hears(/\/watch\s*([^\n\r]*)/, (ctx) => {
    ctx.reply("Registrado!" + JSON.stringify(ctx))
    ctx.reply("A URL é: " + ctx.match[1])
    GetBestPrice(ctx.match[1])
    .then((bestPrice)=> {
        console.log("Melhor preço atual é: " + bestPrice)
        ctx.reply("Melhor preço atual é: " + bestPrice)
    })
})

bot.launch()

// GetBestPrice()
// .then(()=> console.log("finished"))