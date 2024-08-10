2.0.0 / 10-08-2020
==================

Долгожданное глобальное обновление! Бот был полностью переписан, переработано большинство функций. Ниже представлены основные изменения, полный список изменений можете найти здесь: https://ufobot.ru/v2
- Добавлены слеш-команды
- Вместо реакций теперь используются кнопки, списки, модальные окна и т. п.
- Язык сайта меняется без перезагрузки страницы, настройки серверов кешируются
- Обновлен магазин, теперь для товара можно установить необходимый опыт, роли, а также выдачу случайного количества опыта
- Добавлены пользовательские работы. Теперь вместо обычной работы Вы можете установить на сервере список работ со своими параметрами
- Дуэли полностью переработаны. У игроков есть HP, а также добавлено снаряжение
- В приветствиях и сообщениях в ЛС при наказании теперь можно добавить эмбед. Также добавлены кнопки для тестов
- Теперь в случае мута участника бот будет также отправлять его в тайм-аут
- Добавлен новый фильр автомодерации: Флуд
- Донатная функция "Деньги за сообщения" была заменена на "Опыт за сообщения"

Long-awaited global update! Bot has been completely rewritten, a lot of features have been reworked. You can see general changes below, the full list of changes can be found here: https://ufobot.ru/v2
- Added slash commands
- Now instead of reactions bot uses buttons, selects, modals, etc.
- Now website language changes without reloading the page, and server settings are now cached
- Updated shop, now you can set required xp, roles and random values of given xp
- Added custom jobs. Now instead of default work you can set custom jobs with their own options on your server
- Duels completely reworked. Players have HP and also added equipment
- You can now add embed in greetings and punishments DM messages. Also added buttons for testing
- Now in case of mute the member will also be timed out
- Added new automoderation filter: Flood
- Donate feature "Money for messages" replaced with "Experience for messages"

1.2.9 / 13-05-2021
==================

**:globe_with_meridians: Web**
- Обновлена темная тема сайта. Теперь ее палитра состоит из более темных цветов
- Теперь меню настроек сервера доступно только участникам, которые имеют право `Администратор`
- Теперь все сервера в вашем профиле на сайте будут кешироваться до момента закрытия/перезагрузки веб-сайта, потому что процесс загрузки серверов занимает достаточно много времени. Чтобы перезагрузить сервера, нажмите кнопку с иконкой перезагрузки, которая находится рядом с кнопкой `ВЫЙТИ`

**:hammer: Модерация**
- Удалена команда `софтбан`/`softban` и наказание "софтбан" из системы модерации бота. Для кика участника с очисткой сообщений вы можете, например, использовать команду `!врембан <участник> 1сек [дни очистки] [причина]`

**:page_with_curl: Логи**
- Обновлена система логирования
    - Для каждого модераторского действия можно установить свой канал логирования
    - Добавлены логи создания, изменения и удаления ролей
    - Добавлена возможность указать каналы, в которых удаление и изменение сообщения логироваться не будет
    - Улучшена страница настроек логов на сайте

**:globe_with_meridians: Web**
- Updated dark theme. Now its palette consists of darker colors
- Now the server settings menu on the website is only available for members with `Administrator` permission
- Now all servers in your profile on the website will be cached until closing/refreshing the website, because the loading of servers takes a lot of time. To reload the servers, click the button with refresh icon next to the `LOG OUT` button

**:hammer: Moderation**
- Deleted `softban`/`софтбан` command and "softban" punishment from the moderation system. To kick a member with deleting messages, you can, for example, use command `!tempban <member> 1sec [days delete] [reason]`

**:page_with_curl: Logs**
- Updated logging system
    - Now you can set a logging channel for each moderator action
    - Added logs of creating, editing and deleting roles
    - Now you can set channels, in which messages deleting and editing won't be logged
    - Improved logs settings page on the website

1.2.8 / 16-04-2021
==================

**:globe_with_meridians: Web**
- Обновлена цветовая палитра сайта. Теперь он состоит из приятных и сочетающихся цветов
- Добавлен футер в нижнюю часть сайта. В нем содержится несколько полезных ссылок на разные ресурсы и страницы сайта
- Добавлена светлая тема. Тему сайта можно изменить с помощью специального переключателя в правой части футера сайта
- Добавлено единое меню выбора длительности для кулдаунов, длительности наказаний и т.п. Оно представляет собой модальное окно, в котором можно ввести время в секундах, минутах, часах и днях

**:hammer: Модерация**
- Добавлены наказания за предупреждения. Когда участник достигнет определенного количества предупреждений, бот может автоматически выдать ему дополнительное наказание (мут, кик, бан и т.п.). Добавить эти наказания можно в настройках сервера на сайте во вкладке `Модерация`

**:globe_with_meridians: Web**
- Updated website colors palette. Now it consists of pleasant and matching colors
- Added a footer to the bottom of the website. It contains some useful links to several resources or website pages
- Added light theme. You can change website theme with the special switcher on the right side of the footer
- Added a unified menu for entering the duration for cooldowns, punishments durations, etc. It is a modal window where you can input the duration in seconds, minutes, hours and days

**:hammer: Moderation**
- Added punishments for warns. When a member reaches a certain number of warns, the bot will automatically issue him an additional punishment (mute, kick, ban, etc.). You can add these punishments in the server settings on the website in `Moderation` tab

1.2.7 / 01-04-2021
==================

**:money_with_wings: Донат**
- Теперь цена премиум подписки составляет 69 рублей, а не 79

**:tickets: Игры** & **:moneybag: Экономика**
- Повышены лимиты на серверах с UFO бустом:
    - Лимит товаров в магазине: 40 (вместо 15)
    - Лимит розыгрышей: 25 (вместо 10)
    - Лимит купонов: 25 (вместо 10)

**:globe_with_meridians: Web**
- В настройках сервера во вкладке `Команды` теперь также можно настраивать категории команд целиком. Для этого нажмите на значок настройки напротив нужной категории команд и настройте ее. После сохранения все команды данной категории будут иметь указанные настройки

**:money_with_wings: Donate**
- Now the price of premium subscription is 69 rubles, not 79

**:tickets: Games** & **:moneybag: Economy**
- Increased limits for servers with UFO boost:
    - Shop items limit: 40 (instead of 15)
    - Giveaways limit: 25 (instead of 10)
    - Coupons limit: 25 (instead of 10)

**:globe_with_meridians: Web**
- In server settings in `Commands` tab you can now also configure whole commands categories. Click the settings icon in front of category and configure it. After submitting changes, all commands in this category will have specified settings

1.2.6 / 15-03-2021
==================

**:globe_with_meridians: Web**
- Добавлена возможность установить символ денег в экономике на сайте. Сделать это можно в настройках бота во вкладке `Экономика`. Чтобы использовать пользовательское эмодзи, введите его в формате `<:название:id>`
- В навигационное меню добавлен логотип бота
- Теперь можно просматривать баланс каждого участника из таблицы лидеров на сайте. Для этого нужно нажать на его тэг, после чего вы попадете на страницу с балансом участника
- Участники с правом `Управлять сервером` могут изменить баланс любого участника на сайте, сбросить его опыт или вообще удалить из таблицы лидеров. Это можно применять, в том числе, и к участникам, вышедшим с сервера
- Во вкладке `Экономика` в меню настроек добавлена кнопка сброса всех балансов сервера. С ее помощью можно удалить всех участников из таблицы лидеров сервера, тем самым обнулив их балансы. Данное действие необратимо, поэтому, используйте его только при необходимости

**:globe_with_meridians: Web**
- Now you can set economy money symbol on the website. You can do this in bot settings menu in `Economy` tab. To use a custom emoji in money symbol, enter it in `<:name:id>` format
- Added bot logo to navbar
- Now you can view balance of each member in leaderboard on the website. Click on user's username in server leaderboard, and you will be redirected to member's balance page
- Members with `Manage guild` permission can update balance of each member, reset experience or delete from the leaderboard. This can be applied to members who left the server
- In `Economy` tab in bot settings page added all balances reset button. It can delete all members from server leaderboard, thereby resetting their balances. This action is irreversible, so use it only if necessary

1.2.5 / 22-02-2021
==================

**:globe_with_meridians: Web**
- В настройки бота добавлена страница с настройками команд. Там вы можете настроить все команды бота для вашего сервера: включать/отключать их, разрешать и запрещать использовать их определенным ролям и в определенных каналах и т. п. Перейти на эту страницу можно из меню настроек бота, перейдя во вкладку `Команды`
- На главную страницу добавлено описание всего функционала и возможностей бота
- Также на главной странице краткое описание бота теперь имеет эффект набора текста
- Некоторые небольшие обновления дизайна

**:globe_with_meridians: Web**
- Added commands settings page to bot settings. There you can customize all bot commands for your server: enable/disable them, allow of forbid using them for certain roles or in certain channels, etc. You go to this page from bot settings menu by opening `Commands` tab
- Added descriptions of all bot features to the main page
- Added typing effect to short bot description on main page
- Some minor design improvements

1.2.4 / 10-02-2021
==================

**:globe_with_meridians: Web**
- Веб сайт был полностью переписан на фреймворк Vue и UI Фреймворк Vuetify. В связи с этим был полностью переработан и улучшен дизайн сайта, а также пофикшено большое количество багов

**:mobile_phone: Игры**
- Появилась возможность включить комиссию на дуэль. Сделать это можно в настройках бота на сайте во вкладке `Экономика`. В разделе `Комиссия` нажмите галочку рядом с "Действует на дуэль". Тогда введённая комиссия будет действовать на дуэль

**:globe_with_meridians: Web**
- Website has been fully rewritten to Vue framework and UI framework Vuetify. The design was reworked and improved, a lot of bugs were fixed

**:mobile_phone: Games**
- Now you can enable a commission for duel. This can be done in bot settings on the website in `Economy` tab. In `Commission` section check "Applies for duel" box. Then entered commission will be valid for duel

1.2.3 / 17-01-2021
==================

**:beginner: Основное**
- Бот был переписан на шарды. Шарды - это разделение бота на несколько частей, каждая из которых отвечает за определенное количество серверов. Это нужно для того, чтобы большой бот мог подключиться к дискорду. Пока наш бот будет разделен на 2 шарда
- В команде `!сервер` теперь будет отображаться номер шарда, который отвечает за этот сервер

**:globe_with_meridians: Web**
- Теперь на странице статистики бота https://ufobot.ru/stats вы можете видеть статистику каждого шарда (количество серверов, пинг и т.п.)
- Заявка на должность Support и апелляция бана были перенесены на основной сайт
    - Подать заявку на Support (если набор открыт) вы можете здесь: <https://ufobot.ru/support/application>
    - Если вас забанили на сервере поддержки, вы можете подать апелляцию здесь: <https://ufobot.ru/support/appeal>

**:beginner: General**
- Now the bot has sharding. Each shard of the bot is responsible for a certain number of servers. It is necessary for large bots to connect Discord. Out bot has 2 shards
- You can see a number of shard that is responsible for the server using `!server` command

**:globe_with_meridians: Web**
- Now you can see statistics of each shard on the bot stats page https://ufobot.ru/stats
- Support application and ban appeal were moved to the general website
    - You can submit Support application (if the recruitment is opened) here: <https://ufobot.ru/support/application>
    - If you were banned from support server you can appeal here: <https://ufobot.ru/support/appeal>

1.2.2 / 29-12-2020
==================

В этом обновлении было переписано много кода и сделано множество изменений. Ниже вы можете увидеть основные из них

**:globe_with_meridians: Web**
- Обновлена страница статистики бота https://ufobot.ru/stats - улучшен дизайн, убран выбор интервала обновления статистики, а также статистика теперь будет обновляться без перезагрузки страницы каждые 30 секунд
- Временно отключен веб сайт поддержки. Вскоре заявка на Support и апелляция бана будут помещены на основной сайт

**:beginner: Основное**
- Теперь вы можете настроить отдельно язык команд и интерфейса бота! Сделать это можно в настройках сервера на сайте во вкладке `ОСНОВНОЕ`

**:mobile_phone: Игры**
- Теперь время ожидания каждой игры - 2 минуты. По окончании этого времени, если игра не завершена, вам автоматически возвращаются деньги или выигрыш, и игра завершается
- В игре "дуэль" время сражения составляет 2 минуты. Если за это время никто из игроков не наберет 3 очка, объявляется ничья, и игрокам возвращаются поставленные деньги

**:gear: Настройки**
- Удалены все команды тех настроек бота, которые уже есть на сайте

- Множество мелких доработок, улучшений и исправлений

In this update a lot of code was rewritten, and a lot of changes were made. You can see main of them below

**:globe_with_meridians: Web**
- Updated bot statistics page https://ufobot.ru/stats - improved design, removed refresh interval, also statistics will be automatically refreshed every 30 seconds
- Temporarily disabled support website. Soon Support application and ban appeal will be moved to the main website

**:beginner: General**
- Now you can set commands and interface language separately! You can do this in server settings in `GENERAL` tab

**:mobile_phone: Games**
- Now the wait time for all games is 2 minutes. At the end of this time, if the game is not ended, you will get your bet back, and the game will end
- In the "duel" game battle time is 2 minutes. If nobody of the players will get 3 points, the draw will be declared, and the bet will be returned to players

**:gear: Settings**
- Removed all settings commands which are already on the website

- A lot of small improvements and fixes

1.2.1 / 06-12-2020
==================

**:globe_with_meridians: Web**
- Добавлена страница со ссылками на добавление бота на свой сервер! На ней вы можете получить ссылки на добавление бота без прав, с необходимыми ему правами или с правами администратора. Доступна эта страница по этой ссылке: https://ufobot.ru/invite

**:beginner: Основное**
- Теперь при указании канала или роли в команде вы можете вводить не только ID или упоминание, но и название или часть названия роли или канала

**:wrench: Утилиты**
- В команду `!сказать` добавлен флаг `-удалить`. Если его ввести, бот также удалит сообщение с вызовом команды

**:moneybag: Экономика**
Добавлены купоны!
- Чтобы создать купон, введите команду: !создать-купон `<название>` `<сумма>` `<количество использований>` `<время действия>`. На сервере создастся купон под указанным названием. Для использования этой команды участник должен иметь право `Управлять сервером`
- Участник могут забрать купон с помощью команды !купон `<название купона>`. Ему будет начислена установленная сумма купона. Каждый участник может забрать купон только один раз
- Купон теряет свое действие когда заканчивается установленное количество использований или установленное время действия
- Чтобы удалить купон, введите команду: !удалить-купон `<название купона>`. Для использования этой команды участник должен иметь право `Управлять сервером`

**:mobile_phone: Игры**
- Теперь при выигрыше в игре "Камень ножницы бумага" вы получите вашу ставку, увеличенную в 1.5 раза, а не в 2

**:globe_with_meridians: Web**
- Added a page with bot invite links! You can get bot invite link without permissions, with needed permissions or with all permissions. THis page is available via this link: https://ufobot.ru/invite

**:beginner: General**
- Now when you specify a channel or a role in command you can enter not only mention or ID, but a name or a part of name too

**:wrench: Utilities**
- Added flag `-delete` to `!say` command. If you enter it, the bot will delete the usage of command

**:moneybag: Economy**
Added coupons!
- To create coupon, enter: !create-coupon `<name>` `<amount>` `<count of usages>` `<duration>`. A coupon with the specified name will be created on the server. Member need to have `Manage server` permission to use this command
- Member can use the coupon with !coupon `<coupon name>` command. The member will get coupon's amount. Each member can use the coupon only once
- Coupon expires when specified usages count or specified duration ends
- To delete a coupon, enter !delete-coupon `<coupon name>`. Member need to have `Manage server` permission to use this command

**:mobile_phone: Games**
- Now, if you win in "Rock Scissors Paper" game, you will get your bet multiplied by 1.5 times, not by 2

1.2.0 / 26-11-2020
==================

**:globe_with_meridians: Web**
- Теперь получение информации и пользователе при заходе на страницы будет происходить на вашем компьютере, а не на сервере
- Теперь использовать ваш токен из другого приложения в этом невозможно, потому что токены теперь хранятся в базе данных. Они зашифрованы, поэтому доступа к ним не будет даже в случае утечки данных
- Если пользователь не переводил сайт на конкретный язык, то язык будет установлен в соответствии с языком его браузера
- Добавлены ссылки на таблицы лидеров серверов в вашем профиле на сайте https://ufobot.ru/@me (даже тех серверов, где вы не имеете право "Управлять сервером")
- Теперь вы можете увидеть свои значки в боте в вашем профиле на сайте
- Добавлена возможность настраивать магазин на сайте! Это можно сделать на странице настроек бота во вкладке `ЭКОНОМИКА` в самом низу страницы. Все товары расположены в раскрывающихся блоках
    - Нажмите на блок, чтобы изменить товар. После изменения товара сохраните его, нажав на кнопку `Сохранить` в нижней части раскрывающегося блока.
    - Вы также можете удалить товар, нажав кнопку `Удалить`
    - Для создания нового товара нажмите `Создать товар` в нижней части настроек магазина. Во всплывающем окне укажите его настройки и нажмите `Создать`

**:beginner: Основное**
- Добавлены значки донатеров и премиум донатеров в команду `!юзер`

**:globe_with_meridians: Web**
- Now the user on the webpages will be fetched from your computer, not from the server
- Now it is not possible to use token from another application in API because tokens are now stored in database. They are encrypted, so they will not be available even if the data will leak
- If the user hasn't translated the website, the language will be set in accordance with the language of their browser
- Added links to servers' leaderboards in your profile on the website https://ufobot.ru/@me (even servers where you don't have "Manage server" permission)
- Now you can view your badges in bot on the website
- Now you can manage the shop on the website! It is available in bot settings in `Economy` tab in the bottom of the page. All items are in expanding blocks
    - Click the block to edit the item. To save changes, click `Submit` in the bottom of the block
    - You can delete the item by clicking `Delete`
    - To create item, click `Create item` in the bottom of the shop settings. In the modal window configurate the item and click `Create`

**:beginner: General**
- Added badges for donators and premium donators in `!user` command

1.1.9 / 13-11-2020
==================

**Добавлены донаты**
Теперь вы можете поддержать проект бота! За поддержку вы можете получить UFO бусты, которые можно активировать на сервере чтобы получить бонусные функции
Бонусные функции за донат:
- Деньги за сообщения. Установите количество денег, которые будут выдаваться за сообщения на сервере и вероятность выдачи
- Денежные бонусы. Установите ежедневный и еженедельный бонусы, которые участники смогут забирать командами `!ежедневный-бонус` и `!еженедельный-бонус`
- Сообщение в ЛС при наказании. Настройте сообщения, которые будут отправляться в ЛС участникам при кике/софтбане/бане. Эти сообщения используют переменную шаблона `{{punishment}}`, подробнее: https://docs.ufobot.ru/articles/variables#nakazanie
  Активировать UFO Boost на серверах можно командой `!буст`, деактивировать: `!буст снять`. После активации в настройках сервера на сайте будет доступна вкладка `БУСТ`, в которой вы сможете настроить бонусные функции
  Есть 2 подписки: стандартная и премиум
  Стандартная подписка
  UFO бустов: 2
  Роль на сервере поддержки: <@&774318848279052299>
  Цена: 39₽/месяц
  Премиум подписка
  UFO бустов: 4
  Роль на сервере поддержки: <@&774319126822387732>
  Цена: 79₽/месяц
  Чтобы купить подписку, перейдите на https://ufobot.ru/donate , авторизуйтесь, выберите нужную подписку и нажмите соответствующую кнопку. Будет создан счет, на который вы будете перенаправлены. Оплатите счет, и, сразу же после оплаты, вам будут выданы бусты и роль на сервере поддержки. Каждая подписка заканчивается через месяц
  Мы будем благодарны каждому вашему донату 💜

**Added donates**
Now you can support the bot project! For support you can get UFO Boosts which can be activated on servers to get bonus features
Bonus features for donate:
- Money for messages. Set amount of money that will be added for messages on the server and chance of adding
- Money bonuses. Set daily and weekly money bonuses that members can take with commands `!daily-bonus` and `!weekly-bonus`
- Punishments DM messages. Configure messages that will be sent to kicked/softbanned/banned members in DM. These messages use template variable `{{punishment}}`, more information: https://docs.ufobot.ru/articles/variables#nakazanie
  You can activate UFO Boost on servers with command `!boost`, to deactivate use command `!boost remove`. After activation in server settings on the website will be available tab `BOOST` in which you can configure bonus features
  There are 2 subscriptions: standard and premium
  Standard subscription
  UFO Boosts: 2
  Role on the support server: <@&774318848279052299>
  Price: 39₽/month
  Premium subscription
  UFO Boosts: 4
  Role on the support server: <@&774319126822387732>
  Price: 79₽/month
  To buy subscription, go via this link: https://ufobot.ru/donate , authorize, choose needed subscription and click appropriate button. Bill will be created and you will be redirected. Pay the bill, and after the payment you will get UFO Boosts and role on the support server. Every subscription ends in a month
  We will be grateful for each of your donations 💜

1.1.8 / 06-11-2020
==================

**:globe_with_meridians: Web**
- На сайт добавлена таблица лидеров сервера. Введите команду `!лидеры`, она отправит эмбед с лидерами сервера Заголовок эмбеда будет ссылкой на таблицу лидеров на сайте. Для переключения страниц используйте стрелки в левом нижнем углу страницы, для сортировки по балансу/опыту используйте кнопки в правом нижнем углу

**:beginner: Основное**
- Теперь в команде `!хелп` а также в списке команд на сайте отображаются права, которые необходимы для использования команды

**:mobile_phone: Игры**
- Добавлена возможность указывать `все/всё` как ставку чтобы сразу поставить все ваши деньги
- Теперь на дуэль можно вызвать определенного участника. Для этого укажите его после ставки. Использование: !дуэль `<ставка>` `[участник]`

**:globe_with_meridians: Web**
- Added server leaderboard to the website. Enter command `!leaders`. The bot will send an embed with server leaders. Title of this embed is a link to server leaderboard at the website. To switch pages, use arrows at the lower left corner of the page, to sort leaders by balance/experience use the buttons in the lower right corner

**:beginner: General**
- Now you can see required permissions of commands in command `!help` and in the command list on the website

**:mobile_phone: Games**
- Added ability to specify `all` as a bet in games to bet all your money
- Now you can challenge a certain member to a duel. Specify member after the bet to challenge them. Usage: !duel `<bet>` `[member]`

1.1.7 / 01-11-2020
==================

**:globe_with_meridians: Web**
- Теперь у бота есть документация! Доступна она по этой ссылке: https://docs.ufobot.ru
  Там будут размещаться полезные статьи, которые помогут вам в использовании бота
- Теперь автомодерация настраивается на сайте в разделе `Модерация` в самом низу. Выберите нужный фильтр автомодерации и нажмите `Настроить`. Во всплывающем окне настройте фильтр и нажмите `Сохранить` в нижней части всплывающего окна
- Добавлена возможность настраивать комиссию через сайт. Сделать это можно в разделе `Экономика`

**:hammer: Модерация**
- Теперь время можно указывать не только в секундах, минутах, часах и днях, но и в неделях, месяцах и годах! Причем можно указывать несколько единиц за раз. Больше информации здесь: https://docs.ufobot.ru/articles/duration

**:wave: Приветствия**
- В шаблонный движок приветствий добавлена переменная `{{member.nickname}}`. Она показывает никнейм участника на сервере, а если никнейма нет - имя пользователя

**:mobile_phone: Игры**
- Добавлена игра "Дуэль"! Чтобы сыграть в нее, введите: !дуэль `<ставка>`. Первый человек, который нажмет на реакцию и будет вашим соперником. Игроки по очереди стреляют, нажимая на реакцию. Игрок может попасть в другого или промахнуться. Как только кто-то попадет в соперника 3 раза, он победит и заберет деньги

**:globe_with_meridians: Web**
- Now the bot has a documentation! It is available via this link: https://docs.ufobot.ru
  There are some articles that will help you to use the bot
- Now automoderation can be managed only on the website in `Moderation` tab at the bottom. Choose needed automoderation filter and click `Manage`. In the modal window configurate the filter and click `Submit` in the bottom of the window
- Added ability to manage commission on the website in `Economy` tab

**:hammer: Moderation**
- Now duration can be specified not only in seconds, minutes, hours or days, but in weeks, months and years too! Moreover, you can specify several units at one time. More information you can find here: https://docs.ufobot.ru/articles/duration

**:wave: Greetings**
- Added variable `{{member.nickname}}` to the template engine. It shows member's nickname on the server, if there is no nickname, it shows member's username

**:mobile_phone: Games**
- Added game "Duel"! Enter !duel `<bet>` to play it. First member who press the reaction will be your rival. Players take turns shooting by pressing the reaction. Player can hit rival or miss. When someone hits the rival 3 times, he will win and take the money

1.1.6 / 14-10-2020
==================

**:globe_with_meridians: Web**
- Теперь у бота есть веб сайт поддержки! Доступен он по этой ссылке: https://support.ufobot.ru
  На этом сайте вы можете:
    - Отправить запрос в поддержку. Это можно сделать, перейдя по этой ссылке: https://support.ufobot.ru/request
    - Отправить заявку на роль Support, если набор открыт. Это можно сделать, перейдя по этой ссылке: https://support.ufobot.ru/application
    - Если вас забанили на сервере поддержки, вы можете подать апелляцию, перейдя по этой ссылке: https://support.ufobot.ru/appeal
- Теперь на странице настроек бота сохранять настройки можно нажатием Ctrl + Enter
- Некоторые мелкие доработки и улучшения дизайна

**:wave: Приветствия**
- В шаблонный движок добавлена переменная `{{server}}`. Она показывает информацию о сервере, на который зашел или вышел участник. Значения переменной:
    - `{{server.id}}` - ID сервера
    - `{{server.name}}` - название сервера
    - `{{server.memberCount}}` - количество участников сервера
    - `{{server.created}}` - дата создания сервера

**:wrench: Утилиты**
- Теперь в команде `!создать-эмодзи` можно не только указать URL картинки, но и прикрепить ее. Также при ошибке добавления эмодзи будет отображаться точная ошибка.

**:globe_with_meridians: Web**
- Now the bot has a support website. It is available via this link: https://support.ufobot.ru
  On this website you can:
    - Submit a support request. You can do this via this link: https://support.ufobot.ru/request
    - Submit an application for role Support. You can do this via this link: https://support.ufobot.ru/application
    - If you were banned on support server, you can submit an appeal via this link: https://support.ufobot.ru/appeal
- Now you can save changes on settings page with Ctrl + Enter
- Some minor design improvements

**:wave: Greetings**
- Added variable `{{server}}` to template engine. It shows information about server that member joined or left. Variable values:
  - `{{server.id}}` - server ID
  - `{{server.name}}` - server name
  - `{{server.memberCount}}` - amount of server members
  - `{{server.created}}` - server creation date

**:wrench: Utilities**
- Now in command `!create-emote` you can attach image to create an emote from it. Also errors are now exact

1.1.5 / 23-09-2020
==================

**:gear: Настройки**
- Добавлена команда `!мин-ставка`/`!min-bet`. С ее помощью можно настроить минимальную ставку для указанной игры. Если установлена минимальная ставка для игры, игроки не смогут поставить число денег, меньше минимальной ставки. Использование: !мин-ставка `<минное-поле/краш-казино/джекпот/камень-ножницы-бумага>` `<ставка>`. Для использования этой команды нужно иметь право `УПРАВЛЯТЬ_СЕРВЕРОМ`

**:moneybag: Экономика**
- Теперь команды, позволяющие управлять балансом игроков (`!добавить-деньги`, `!установить-баланс` и др.) доступны для участников с правом `УПРАВЛЯТЬ_СЕРВЕРОМ`

**:globe_with_meridians: Web**
- Добавлена новая страница настроек бота - модерация. На ней вы можете настроить роль мута, а также модераторские роли сервера и их права
- На страницу с настройкой экономики добавлена возможность настраивать минимальные ставки в играх

**:gear: Settings**
- Added commands `!min-bet`/`!мин-ставка`. With this command you can set minimal bet for specified game. If a minimal bet is specified for the game, players will cannot bet less than this amount. Usage: !min-bet `<minefield/crash-casino/jackpot/rock-scissors-paper>` `<bet>`. You need to have `MANAGE_SERVER` permission to use this command

**:moneybag: Economy**
- Now the balance managing commands (such as `!add-money`, `!set-balance`, etc.) are available only for members with `MANAGE_SERVER` permission

**:globe_with_meridians: Web**
- Added new page to bot settings - moderation. You can set mute role and configurate moderator role and their permissions on this page
- Now you can set minimal bets for games at the economy settings page

1.1.4 / 11-09-2020
==================

**:globe_with_meridians: Web**
Релиз бета-версии сайта!
- Полностью переработан и улучшен дизайн сайта
- На странице с командами https://ufobot.ru/commands теперь команды располагаются в раскрывающихся блоках. Чтобы посмотреть список команд определенной категории, нажмите на соответствующий блок, и он раскроется. Чтобы посмотреть информацию об отдельной команде, нажмите на значок информации справа от нее (информация будет показана во всплывающем окне)
- В профиле пользователя <https://ufobot.ru/@me> сервера теперь располагаются в виде сетки
- Страница настроек сервера разделена на 4 страницы:
    - Основное `/server/:id/general`
    - Экономика `/server/:id/economy`
    - Логи `/server/:id/logs`
    - Приветствия `/server/:id/greetings`
- При добавлении бота на сервер авторизованные пользователи будут перенаправляться на страницу с настройками сервера. Неавторизованные - на страницу благодарностью за добавление и полезными ссылками: <https://ufobot.ru/landing>

**:globe_with_meridians: Web**
Website beta release!
- Completely reworked and improved website design
- In commands page https://ufobot.ru/commands commands are located in expanding blocks. To view list of commands from category, click the appropriate block, and it will expand. To view information about one command, click the info icon to its right (information will appear in modal window)
- Servers in user profile <https://ufobot.ru/@me> are now displayed in a flexbox
- Settings page is now divided into 4 pages:
    - General `/server/:id/general`
    - Economy `/server/:id/economy`
    - Logs `/server/:id/logs`
    - Greetings `/server/:id/greetings`
- When adding the bot to the server, authorized users will be redirected to server settings page, unauthorized - to the page with gratitudes and useful links: <https://ufobot.ru/landing>

1.1.3 / 07-09-2020
==================

**:globe_with_meridians: Web**
- Добавлена страница со статистикой бота. На ней вы можете посмотреть статистику бота, его пинг и аптайм сервера. Доступна она по этой ссылке: https://ufobot.ru/stats

**:beginner: Основное**
- Теперь при указании пользователя или участника в команде вы можете указать не только ID или упоминание, но и часть имени пользователя, тега или никнейма. Также вы можете ввести `^`, чтобы указать пользователя/участника из сообщения выше

**:moneybag: Экономика**
- Время кулдауна команд `!работать` и `!мешки` теперь будет показываться в днях, часах, минутах и секундах

**:hammer: Модерация**
- Теперь для использования команд `!мут` и `!размут` участник должен иметь право `ВЫГОНЯТЬ_УЧАСТНИКОВ`

**:globe_with_meridians: Web**
- Added bot stats page. You can see bot stats, ping and uptime there. It is available via this link: https://ufobot.ru/stats

**:beginner: General**
- Now, when you specify user or member in commands, you can specify their ID, mention, username, tag, nickname. Also you can enter `^` to specify member/user from message above

**:moneybag: Economy**
- Cooldown duration in commands `!work` and `!moneybags` will be displayed in days, hours, minutes and seconds

**:hammer: Moderation**
- Now member need to have `KICK_MEMBERS` permission to use commands `!mute` and `!unmute`

1.1.2 / 28-08-2020
==================

**:globe_with_meridians: Web**
- В панель настроек в разделе "Приветствия" добавлена возможность настраивать роли при входе
- Добавлена документация шаблонного движка бота и его переменных. Доступна она по этой ссылке: https://ufobot.ru/variables
- В самый низ панели настроек добавлена кнопка `Удалить бота`. Если вы ее нажмете, бот выйдет с сервера. Она доступна только участникам, которые могут кикнуть или забанить бота на сервере
- Некоторые мелкие доработки и улучшения дизайна

**:beginner: Основное**
- В команде `!сервер` переведены регионы сервера и добавлены флаги
- Команда `!хелп` теперь может показывать информацию о категориях. Использование: !хелп `[команда/категория]`

**:wrench: Утилиты**
- Теперь в команде `!раскладка` аргумент языка необязателен. Если вы не укажете язык раскладки, бот автоматически сменит его на противоположный. Также добавлен алиас `т`

**:globe_with_meridians: Web**
- Now you can add or remove join roles at the website in "Greetings" section on settings page
- Added documentation of bot's template engine and its variables. It is available via this link: https://ufobot.ru/variables
- Added button `Delete bot` to the bottom of settings page. If you press it, the bot will leave the server. This button is available only for members who can kick or ban the bot on the server
- Some minor design improvements

**:beginner: General**
- Translated regions in command `!server` and added flags to them
- Now command `!help` can show information about categories. Usage: !help `[command/category]`

**:wrench: Utilities**
- Now language argument in command `!keyboard-layout` is optional. If you won't specify layout language, bot will automatically change it to opposite. Also added aliase `t`

1.1.1 / 21-08-2020
==================

**:globe_with_meridians: Web**
Теперь на сайте есть возможность настраивать бота!
- Для начала вам нужно авторизоваться. Для этого нажмите на кнопку `ВОЙТИ`/`LOG IN` в правом верхнем углу и авторизуйте приложение. После этого вы будете перенаправлены в ваш профиль на сайте: https://ufobot.ru/@me
- В профиле будут показаны ваши сервера, где вы имеете право `УПРАВЛЯТЬ_СЕРВЕРОМ`, а также ссылки на настройки бота на этих серверах либо добавление туда бота. Вы можете перейти в ваш профиль из любой страницы сайта, нажав на имя пользователя в правом верхнем углу (если вы авторизованы)
- На странице с настройкой сервера вы можете настроить префикс бота, язык, роль мута, зарплату и мешки, а также логи и приветствия. Не забудьте сохранить изменения после настройки! На страницу настройки сервера могут получить доступ только участники этого сервера с правом `УПРАВЛЯТЬ_СЕРВЕРОМ`
- Значок перевода сайта был перемещен в левый верхний угол

**:hammer: Модерация**
- Лимит длительности мута и врембана повышен до 10 лет
- Теперь при использовании команд `!мут` и `!врембан` будет показываться дата снятия наказания в футере эмбеда

**:tickets: Игры** & **:moneybag: Экономика**
- В конце каждой игры, а также в командах `!работать` и `!мешки` будет показываться ваш текущий баланс

**:globe_with_meridians: Web**
Now you can edit server settings on the website!
- First you need to login. To do this, click `LOG IN`/`ВОЙТИ` at the top right corner and authorize the application. Then you will be redirected to your profile on website: https://ufobot.ru/@me
- In profile are shown your servers, where you have `MANAGE_SERVER` permission and links to settings page of those servers or bot invite links to those servers. You can go to your profile from any page of the website by ckicking on your username in top right corner (if you are logged in)
- At the server settings page you can edit bot prefix, language, mute role, salary and moneybags settings, logs and greetings. Don't forget to submit changes! Server settings page is only available for members with `MANAGE_SERVER` premission
- Translate icon has been moved to the top left corner

**:hammer: Moderation**
- Mute and tempban duration limit increased to 10 years
- Now, when using commands `!mute` and `!tempban`, in the footer of embed will be displayed the date of removing punishment

**:tickets: Games** & **:moneybag: Economy**
- Now, at the end of all games and in commands `!work` and `!moneybags` will be shown your current balance

1.1.0 / 08-08-2020
==================

**:globe_with_meridians: Web**
- Теперь у бота есть веб сайт! Доступен он по этой ссылке: https://ufobot.ru
  Сайт имеет 2 языка. Чтобы сменить язык, нажмите на значок перевода в правом верхнем углу
- На главной странице сайта есть краткое описание бота и ссылка на добавление. Ссылка на главную страницу: https://ufobot.ru
- Также у сайта есть страница с командами. На ней есть список команд, распределенных по категориям. Вы можете нажать на определенную команду и получить подробную информацию о ней. Ссылка на страницу с командами: https://ufobot.ru/commands

**:beginner: Основное**
- Добавлена команда `!инфо/!info`. Она показывает краткую информацию о боте, а также ссылки на разные ресурсы

**:globe_with_meridians: Web**
- Now the bot has website! It is available via this link: https://ufobot.ru
  Website has 2 languages. To change language, click on the translate icon in upper right corner
- On the main page there's a short description of the bot and invite link. Link to the main page: https://ufobot.ru
- Also website has "Commands" page. It has a list of commands, sorted by categories. You can click at one command to get full information about it. Link to "Commands" page: https://ufobot.ru/commands

**:beginner: General**
- Added command `!info/!инфо`. It shows short information about the bot and links to some resources

1.0.9 / 05-08-2020
==================

**:beginner: Основное**
- Теперь в команде `!юзер` можно получить информацию о любом пользователе, не только участнике сервера. Также были добавлены 2 новых значка: <:ufobot_tester:740479721409740821> - для тестеров, <:ufobot_bughunter:740335297522434189> - для баг хантеров

**:hammer: Модерация**
- Добавлена команда `!преды/!warns`. Она показывает предупреждения указанного участника и их причины. Если участник не указан - ваши предупреждения. Использование команды: !преды `[участник]` `[страница]`

**:wrench: Утилиты**
- Удалена команда `!язык/!language`

**:gear: Настройки**
- Команда `!установить-язык` была переименована в `!язык`, а также теперь при ее использоании не обязательно указывать язык. Если язык не уканан, бот автоматически изменит его на противоположный

**:beginner: General**
- Now command `!user` shows information about any user, not only about server member. Also added 2 new badges: <:ufobot_tester:740479721409740821> - for testers, <:ufobot_bughunter:740335297522434189> - for bug hunters

**:hammer: Moderation**
- Added command `!warns/!преды`. It shows warns of specified member and their reasons. If member is not specified, the command will show your warns. Command usage: !warns `[member]` `[page]`

**:wrench: Utilities**
- Deleted commands `!language/!язык`

**:gear: Settings**
- Command `!set-language` was renamed to `!language`. Also now you don't have to specify language when you use this command. If language is not specified, bot will automatically change it to opposite

1.0.8 / 01-08-2020
==================

**Добавлены приветствия!**
- Добавлена возможность настраивать сообщения, которые будут отправляться при входе и выходе участников, а также личные сообщения новым участникам. Приветствия используют шаблонный движок. Для получения подробной информации, введите команду `!приветствия-хелп`
- Чтобы настроить сообщение при входе участника, введите команду: !вход-сообщение `<включить/отключить>` `[канал]` `[шаблон сообщения]`
- Чтобы настроить сообщение при выходе участника, введите команду: !выход-сообщение `<включить/отключить>` `[канал]` `[шаблон-сообщения]`
- Команда !вход-лс `<включить/отключить>` `[шаблон сообщения]` позволяет настроить личные сообщения новым участникам

**Основное**
- Удалено первое сообщение из команды `!хелп`

**Настройки**
- Удалены все команды из категории **:page_with_curl:Логи**. Теперь логи настраиваются одной командой: !логи `<удаление-сообщений/изменение-сообщений/модерация>` `<включить/отключить>` `[канал]`. Эта команда была перемещена в категорию **:gear:Настройки**

**Модерация**
- Теперь в команде `!очистить` можно использовать несколько фильтров за раз, лимит - 5 фильтров за очистку. Но будьте осторожны - неправильное написание фильтра может привести к удалению всего введенного количества сообщений

**Added greetings!**
- Now you can set messages that will be send when member join or leave server and direct messages to joined members. Greetings use template engine. To get more information, enter command `!greetings-help`
- To set message about joined members, emter command: !join-message `<enable/disable>` `[channel]` `[message template]`
- To set message about left members, emter command: !leave-message `<enable/disable>` `[channel]` `[message template]`
- Command !join-dm `<enable/disable>` `[message template]` sets direct message to new members

**General**
- Removed first message in command `!help`

**Settings**
- Removed all commands from category **:page_with_curl:Logs**. Now logs are configured with one command: !logs `<message-delete/message-edit/moderation>` `<enable/disable>` `[channel]`. This command is moved to category **:gear:Settings**

**Moderation**
- Now you can use multiplie filters in command `!clear`, limit is 5 filters. But be careful - incorrect spelling of filter can lead to deletion of all specified amount of messages

1.0.7 / 21-07-2020
==================

**Экономика**
Добавлен новый способ заработка - мешки с деньгами
- Введите команду `!мешки` (`!moneybags`). Вам нужно будет выбрать один из трех мешков реакциями. В мешке могут находиться как деньги, так и бомба, которая взорвет часть ваших денег!
- Чтобы настроить игру с мешками, введите команду: !мешки-настройки `<деньги/кулдаун>` `<значение>`. Для использования этой команды нужно иметь право `УПРАВЛЯТЬ_СЕРВЕРОМ`.

**Модерация**
- Улучшена команда `!очистить` - теперь за раз можно очищать до 1000 сообщений. Также было добевлено множество фильтров, таких как пользователи, упоминания и даже приглашения.

**Автомодерация**
Добавлена автомодерация на приглашения
- Для настройки автомодерации введите команду: !автомод-приглашения `<включить/отключить>` `[наказание]`. В наказании также можно указать время, дни очистки и причину.
- Для настройки белого списка были добавлены команды `!разрешенные-приглашения` и `!белый-список`.
  Для использования этих команд нужно иметь право `АДМИНИСТРАТОР`.


**Economy**
Added new way to earn money - moneybags
- Enter command !moneybags (`!мешки`). You will need to choose one of three moneybags. Moneybag can contain money or a bomb that will burst some of your money!
- To customize moneybags game, enter command: !moneybags-settings `<money/cooldown>` `<value>`. You need to have `MANAGE_SERVER` permission to use this command.

**Moderation**
- Improved `!clear` command - now you can clear up to 1000 messages. Also added many filters, such as users, mentions and even invites.

**Automoderation**
Added invites automoderation
- To configure automoderation, enter command: !invites-automod `<enable/disable>` `[punishment]`. You can also specify punishment duration, days delete and reason.
- Use commands `!allowed-invites` and `!whitelist` to configure automoderation whitelist.

1.0.6 / 04-07-2020
==================

**Основное**
- Добавлена команда `!пинг` (английская - `!ping`). Она показывает пинг бота, пинг базы данных, время изменения сообщений, а также состояние дискорда.

**Экономика**
- Добавлена возможность устанавливать символ денег на серверах. Для этого используйте команду: !символ-денег `<новый символ>`. Если вы хотите использовать эмодзи с другого сервера как символ денег, бот также должен находиться на этом сервере, иначе это эмодзи работать не будет. Вы должы иметь право `УПРАВЛЯТЬ_СЕРВЕРОМ` чтобы использовать эту команду.

**Утилиты**
Добавлены заметки! Теперь вы можете создавать свои заметки, и они будут доступны на всех серверах.
- Чтобы создать заметку, введите команду: !создать-заметку `<текст>`. Текст заметки не должен быть длиннее 500 символов. Также вы можете создать не больше 10 заметок.
- Чтобы увидеть все свои заметки, введите команду `!список-заметок`.
- Чтобы удалить свою заметку, введите команду: !удалить-заметку `<номер заметки>` (номера заметок можно увидеть в списке).


**General**
- Added command `!ping` (russian - `!пинг`). It shows bot ping, database ping, message edit time and Discord state.

**Economy**
- Added ability to set money symbol on servers. To do this, use command: !money-symbol `<new symbol>`. If you want to use emoji from another server as a money symbol, the bot also must be at this server, otherwise this emoji will not work. You need to have `MANAGE_SERVER` permission to use this command.

**Utilities**
Added notes! Now you can create your notes and they will be available on all servers.
- To create note, enter command: !create-note `<text>`. Note cannot be longer than 500 characters. Also you can create not more than 10 notes.
- To view all your notes, enter command `!notelist`.
- To delete your note, enter command: !delete-note `<note number>` (you can see notes numbers in notelist).

1.0.5 / 18-06-2020
==================

- Теперь бот реагирует на команды с упоминанием. Вы можете ввести упоминание бота и __через пробел__ - саму команду. Например: <@705372408281825350> help

**Основное**
- Добавлена команда `!роль-инфо` (английская - `!role-info`). Она показывает информацию об указанной роли: цвет, позиция, дата создания и т. д. Использование команды: !роль-инфо `<роль>`.

**Экономика**
- Добавлена комиссия при выдаче денег командой `!дать-деньги`, то есть пользователь, которому дают деньги будет получать на определенное количество процентов денег меньше, чем ему дали.
- Чтобы установить комиссию на сервере, введите команду: !установить-комиссию `<процент>`. Для использования этой команды нужно иметь правом `УПРАВЛЯТЬ_СЕРВЕРОМ`.


- Now bot responds to commands with mention. You can mention bot and then enter command __using space__. For example: <@705372408281825350> help

**General**
- Added command `!role-info` (russian - `!роль-инфо`). It whows information about specified role: its color, position, creation date, etc. Command usage: !role-info `<role>`.

**Economy**
- Added commission to command `!give-money`. That means that user who is given money will receive a certain percentage of money less than he was given.
- To set server comission, use command: !set-comission `<percentage>`.

1.0.4 / 10-06-2020
==================

**Основное**
- Улучшен вид команды `!стат`.

**Настройки**
- Добавлена команда `!вход-роль` (английская - `!join-role`). С ее помощью можно настроить роли, которые будут выдаваться участникам при входе. Использование команды: !вход-роль `<добавить/удалить>` `<роль>`. Участник должен иметь право `УПРАВЛЯТЬ_РОЛЯМИ` чтобы использовать эту команду.

**Утилиты**
- Добавлена команда `!создать-эмодзи` (английская - `!create-emote`). Она создает эмодзи на сервере из указанной ссылки на картинку. Также нужно указать название этого эмодзи. Использование команды: !создать-эмодзи `<ссылка на изображение>` `<название>`. Участник должен иметь право `УПРАВЛЯТЬ_ЭМОДЗИ` чтобы использовать эту команду.

**Модерация**
- Добавлена команда `!врембан` (английская - `!tempban`). Она банит указанного пользователя и возвращает его из бана через указанное количество времени. Длительность бана также нужно указывать с единицей измерения (`с`, `м`, `ч` или `д`). Использование команды: !врембан `<пользователь>` `<длительность>` `[дни очистки]` `[причина]`.


**General**
- Improved appearance of `!stats` command.

**Settings**
- Added command `!join-role` (russian - `!вход-роль`). You can set roles that are added to joined members with this command. Command usage: !join-role `<add/remove>` `<role>`. Members need to have `MANAGE_ROLES` permission to use this command.

**Utilities**
- Added command `!create-emote` (russian - `!создать-эмодзи`). This commands creates an emote on the server from specified image URL. Also you need to specify this emote's name. Command usage: !create-emote `<image URL>` `<name>`. Members need to have `MANAGE_EMOJIS` permission to use this command.

**Moderation**
- Added command `!tempban` (russian - `!врембан`). This command bans specified user and unbans them in specified duration. Ban duration needs to be specified with unit (`s`, `m`, `h` or `d`). Command usage: !tempban `<user>` `<duration>` `[days delete]` `[reason]`.

1.0.3 / 04-06-2020
==================

**Утилиты**
- Добавлена команда - `!ресайз`. Она изменяет размер прикрепленного изображения на указанную длину и ширину.

**Экономика**
Добавлены розыгрыши на деньги!
- Чтобы создать розыгрыш, введите: !розыгрыш `<количество денег>` `<время>`. Бот опубликует сообщение с розыгрышем. Если участники хотят участвовать в розыгрыше, они должны будут нажать <a:giveaway:717496538510655556> под этим сообщением. В конце розыгрыша бот случайным образом определит победителя и выдаст ему деньги.
- Если вы хотите отменить розыгрыш, введите: !отменить-розыгрыш `<номер розыгрыша>`.
  Для создания и отмены розыгрышей нужно иметь право `АДМИНИСТРАТОР`.


**Utilities**
- Added command `!resize`. It resizes attached image to specified width and height.

**Economy**
Added money giveaways!
- To create giveaway, enter: !giveaway `<amount of money>` `<duration>`. Bot will send a message with giveaway. Members will need to react with <a:giveaway:717496538510655556> under this message to join giveaway. At the end of giveaway, bot will automatically add money to a random winner.
- To cancel giveaway, enter: !cancel-giveaway `<giveaway number>`.
  You need to have `ADMINISTRATOR` permission to create or cancel giveaways.

1.0.2 / 31-05-2020
==================

**Основное**
- Улучшен вид команд `!сервер` и `!юзер`. В команду `!юзер` добавлены значки профиля пользователя.

**Модерация**
- Добавлена возможность удалять сообщения определенного пользователя в команде `!очистить`. Для этого упомяните или укажите ID этого пользователя в конце команды. Использование: !очистить `<количество>` `[пользователь]`.

**Экономика**
- Теперь команды на управление магазином (`!создать-товар`, `!изменить-товар` и `!удалить-товар`) доступны только участникам с правом `АДМИНИСТРАТОР`.

**Утилиты**
- Добавлена команда `!изменения`. Она показывает все изменения сообщения под указанным айди. Работает только с сообщениями из текущего канала, невозможно посмотреть изменения сообщения из одного канала, использовав команду в другом.

- Пофикшено большинство багов, в том числе и мут на отрицательное количество времени.


**General**
- Improved appearance of `!server` and `!user` commands. Added user's profile badges in `!user` command.

**Moderation**
- Now you can delete one user's messages with command `!clear`. Just mention or enter this user's ID. Usage: !clear `<amount>` `[user]`.

**Economy**
- Now shop managing commands (`!create-item`, `!edit-item` and `!delete-item`) are available only for members with `ADMINISTRATOR` permissions.

**Utilities**
- Added `!edits` command. This command shows edits of message with specified ID. This works only with messages from current channel, you can't see message edits from one channel using the command in another.

- Fixed many bugs, including mute for negative amount of time.

1.0.1 / 26-05-2020
==================

**Экономика**
- В команду `!баланс` добавлено место участника в таблице лидеров.
- Товары из магазина теперь будут сортироваться по цене - от самой меньшей до самой большей.

**Утилиты**
- В команду `!аватар` добавлены ссылки на аватар участника в 3 форматах - webp, jpg и png.

**Модерация**
- Добавлена команда `!слоумод` (английская - `!slowmode`). Она активирует медленный режим в текущем канале на указанное количество времени. Время указывается с единицей изменения, например: `1с`, `1м`, `1ч`. Чтобы использовать эту команду, нужно иметь права `УПРАВЛЯТЬ_КАНАЛАМИ`. Время медленного режима не должно быть больше 6 часов.


**Economy**
- Added member's place in leaderboard in command `!balance`
- Items in the shop are sorced by price - from the lowest to the highest.

**Utilities**
- Added member's avatar URLs in `!avatar` command in 3 formats - webp, jpg and png.

**Moderation**
- Added command `!slowmode` (russian - `!слоумод`). It activates a slow mode in current channel for specified amount of time. Specify time with unit, for example: `1s`, `1m`, `1h`. You need to have `MANAGE_CHANNELS` permission to use this command. Slowmode time may not be longer than 6 hours.

1.0.0 / 25-05-2020
==================

Релиз бота!
- Для помощи в использовании введите `!help`. Для получения информации об отдельной команде введите `!help [команда]`
- [Нажмите сюда](https://discordapp.com/api/oauth2/authorize?client_id=705372408281825350&permissions=403549310&scope=bot) чтобы добавить бота на свой сервер!

Bot release!
- To get help in usage, enter `!help`. To get information about one command, use `!help [command]`
- [Click here](https://discordapp.com/api/oauth2/authorize?client_id=705372408281825350&permissions=403549310&scope=bot) to add the bot to your server!