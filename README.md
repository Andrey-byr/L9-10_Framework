# Театральная и стриминговая API система

Минималистичный веб-фреймворк для Node.js для управления театральными и стриминговыми данными.

## Сущности

### 1. Сотрудники (employees)
- `id` (string) - уникальный идентификатор
- `fullName` (string) - полное имя сотрудника
- `age` (number) - возраст
- `isFullTime` (boolean) - работает ли на полную ставку
- `departments` (Array<string>) - отделы, в которых работает
- `hireDate` (string) - дата приема на работу

### 2. Спектакли (spectacles)
- `id` (string) - уникальный идентификатор
- `title` (string) - название спектакля
- `year` (number) - год создания
- `isPremiere` (boolean) - является ли премьерой
- `genres` (Array<string>) - жанры
- `firstPerformanceDate` (string) - дата первого показа

### 3. Фильмы (films)
- `id` (string) - уникальный идентификатор
- `title` (string) - название фильма
- `duration` (number) - продолжительность в минутах
- `is3D` (boolean) - доступен ли в 3D
- `genres` (Array<string>) - жанры
- `releaseDate` (string) - дата выпуска

### 4. Кинотеатры (cinemas)
- `id` (string) - уникальный идентификатор
- `name` (string) - название кинотеатра
- `totalHalls` (number) - количество залов
- `hasIMAX` (boolean) - есть ли IMAX
- `openingHours` (Array<string>) - часы работы
- `openingDate` (string) - дата открытия

### 5. Стримеры (streamers) - Twitch-like
Данные о пользователях, проводящих трансляции.
* **id** (string/UUID) — уникальный идентификатор стримера.
* **username** (string) — уникальное имя пользователя.
* **category** (string) — текущая категория контента (например, "Just Chatting").
* **followers** (number) — общее количество подписчиков канала.
* **isLive** (boolean) — статус прямого эфира (true — в сети, false — офлайн).
* **channelCreated** (string) — дата и время создания канала в формате ISO 8601.
* **tags** (Array<string>) — список тегов, характеризующих трансляции (например, "RU", "EN").

### 6. Стримы (streams) - Twitch-like
Данные о конкретных сессиях трансляций.
* **id** (string) — уникальный идентификатор трансляции.
* **title** (string) — название текущего или прошедшего стрима.
* **viewers** (number) — текущее количество зрителей на трансляции.
* **moderationEnabled** (boolean) — флаг использования инструментов автоматической модерации.
* **moderators** (Array<string>) — список имен пользователей, имеющих права модератора.
* **startedAt** (string) — время начала трансляции в формате ISO 8601.
## API Endpoints

### Основной маршрут
- `GET /` - информация о системе

### Сотрудники
- `GET /employees` - получить всех сотрудников
- `GET /employees/:id` - получить сотрудника по ID
- `POST /employees` - создать нового сотрудника
- `PUT /employees/:id` - обновить сотрудника
- `PATCH /employees/:id` - частично обновить сотрудника
- `DELETE /employees/:id` - удалить сотрудника

### Спектакли
- `GET /spectacles` - получить все спектакли
- `GET /spectacles/:id` - получить спектакль по ID
- `POST /spectacles` - создать новый спектакль
- `PUT /spectacles/:id` - обновить спектакль
- `PATCH /spectacles/:id` - частично обновить спектакль
- `DELETE /spectacles/:id` - удалить спектакль

### Фильмы
- `GET /films` - получить все фильмы
- `GET /films/:id` - получить фильм по ID
- `POST /films` - создать новый фильм
- `PUT /films/:id` - обновить фильм
- `PATCH /films/:id` - частично обновить фильм
- `DELETE /films/:id` - удалить фильм

### Кинотеатры
- `GET /cinemas` - получить все кинотеатры
- `GET /cinemas/:id` - получить кинотеатр по ID
- `POST /cinemas` - создать новый кинотеатр
- `PUT /cinemas/:id` - обновить кинотеатр
- `PATCH /cinemas/:id` - частично обновить кинотеатр
- `DELETE /cinemas/:id` - удалить кинотеатр

### Стримеры
- `GET /streamers` - получить всех стримеров
- `GET /streamers/:username` - получить стримера по username
- `POST /streamers` - создать нового стримера
- `PUT /streamers/:username` - обновить стримера
- `PATCH /streamers/:username` - частично обновить стримера
- `DELETE /streamers/:username` - удалить стримера

### Стримы
- `GET /streams` - получить все стримы
- `GET /streams/:id` - получить стрим по индексу (ID)
- `POST /streams` - создать новый стрим
- `PUT /streams/:id` - обновить стрим
- `PATCH /streams/:id` - частично обновить стрим
- `DELETE /streams/:id` - удалить стрим


  