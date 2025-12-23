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
- `username` (string) - уникальное имя пользователя
- `category` (string) - категория стрима
- `followers` (number) - количество подписчиков
- `isLive` (boolean) - в эфире ли сейчас
- `channelCreated` (string) - дата создания канала (ISO)
- `tags` (Array<string>) - теги канала

### 6. Стримы (streams) - Twitch-like
- `title` (string) - название стрима
- `viewers` (number) - количество зрителей
- `moderationEnabled` (boolean) - включена ли модерация
- `startedAt` (string) - время начала стрима (ISO)
- `moderators` (Array<string>) - список модераторов

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

## Примеры запросов для новых сущностей

### Создание стримера:
```bash
curl -X POST http://localhost:3000/streamers \
  -H "Content-Type: application/json" \
  -d '{
    "username": "CoolStreamer",
    "category": "Gaming",
    "followers": 50000,
    "isLive": true,
    "channelCreated": "2020-03-15T00:00:00Z",
    "tags": ["EN", "Gaming"]
  }'


  