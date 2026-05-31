-- Скрипт для добавления 20 блогеров в таблицу profiles
-- ВНИМАНИЕ: Этот скрипт генерирует случайные UUID для демонстрации. 
-- В реальной системе пользователи должны быть сначала созданы в auth.users.
-- Но для тестирования интерфейса мы можем вставить их напрямую в public.profiles, 
-- если у вас нет строгих ограничений Foreign Key на auth.users.

INSERT INTO public.profiles (id, role, full_name, avatar_url, bio, social_links)
VALUES 
(gen_random_uuid(), 'blogger', 'Алексей Глазачев', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 'Обзоры гаджетов и уютный лайфстайл', '{"handle": "@glazachev_tech", "followers": "15K", "platform": "Telegram"}'),
(gen_random_uuid(), 'blogger', 'Мария Профуд', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', 'Честные обзоры ресторанов Москвы', '{"handle": "@pro_food_msk", "followers": "42K", "platform": "Instagram"}'),
(gen_random_uuid(), 'blogger', 'Иван Походный', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan', 'Бюджетные путешествия по России', '{"handle": "@ivan_travel", "followers": "28K", "platform": "YouTube"}'),
(gen_random_uuid(), 'blogger', 'Елена Стиль', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', 'Минимализм в гардеробе и локальные бренды', '{"handle": "@elena_style", "followers": "12K", "platform": "Instagram"}'),
(gen_random_uuid(), 'blogger', 'Дмитрий Код', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry', 'Будни программиста и полезные сервисы', '{"handle": "@dimacode", "followers": "8K", "platform": "Telegram"}'),
(gen_random_uuid(), 'blogger', 'Анна Книжная', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', 'Читаю по книге в неделю. Обзоры без спойлеров', '{"handle": "@anna_books", "followers": "21K", "platform": "YouTube"}'),
(gen_random_uuid(), 'blogger', 'Сергей Авто', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sergey', 'Вторичный рынок авто: как не купить хлам', '{"handle": "@sergey_auto", "followers": "55K", "platform": "VKontakte"}'),
(gen_random_uuid(), 'blogger', 'Ольга Фит', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga', 'Йога дома и здоровые привычки', '{"handle": "@olga_fit", "followers": "33K", "platform": "Instagram"}'),
(gen_random_uuid(), 'blogger', 'Павел Дизайн', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pavel', 'Про UX/UI дизайн и фриланс', '{"handle": "@pavel_design", "followers": "19K", "platform": "Telegram"}'),
(gen_random_uuid(), 'blogger', 'Юлия Мама', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yulia', 'Развивающие игры и будни молодой мамы', '{"handle": "@yulia_mom", "followers": "67K", "platform": "Instagram"}'),
(gen_random_uuid(), 'blogger', 'Артем Стройка', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artem', 'Ремонт своими руками: от и до', '{"handle": "@artem_build", "followers": "89K", "platform": "YouTube"}'),
(gen_random_uuid(), 'blogger', 'Ксения Косметик', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ksenia', 'Разбор составов бюджетной косметики', '{"handle": "@ksenia_beauty", "followers": "45K", "platform": "TikTok"}'),
(gen_random_uuid(), 'blogger', 'Максим Финанс', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maxim', 'Инвестиции для начинающих простыми словами', '{"handle": "@max_finance", "followers": "24K", "platform": "Telegram"}'),
(gen_random_uuid(), 'blogger', 'Светлана Сад', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Svetlana', 'Дачные хитрости и комнатные растения', '{"handle": "@svet_garden", "followers": "11K", "platform": "VKontakte"}'),
(gen_random_uuid(), 'blogger', 'Игорь Гейм', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Igor', 'Обзоры инди-игр и ретро-консолей', '{"handle": "@igor_games", "followers": "37K", "platform": "YouTube"}'),
(gen_random_uuid(), 'blogger', 'Наталья Психолог', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natalia', 'Как справиться с выгоранием и стрессом', '{"handle": "@nat_psy", "followers": "52K", "platform": "Instagram"}'),
(gen_random_uuid(), 'blogger', 'Виктор Фото', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viktor', 'Уроки мобильной фотографии', '{"handle": "@viktor_photo", "followers": "14K", "platform": "TikTok"}'),
(gen_random_uuid(), 'blogger', 'Марина Английский', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marina', 'Английский по песням и мемам', '{"handle": "@marina_eng", "followers": "95K", "platform": "Instagram"}'),
(gen_random_uuid(), 'blogger', 'Роман Крафт', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roman', 'Изделия из кожи своими руками', '{"handle": "@roman_leather", "followers": "7K", "platform": "YouTube"}'),
(gen_random_uuid(), 'blogger', 'Екатерина Эко', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ekaterina', 'Zero waste жизнь в большом городе', '{"handle": "@eco_katya", "followers": "18K", "platform": "Telegram"}');
