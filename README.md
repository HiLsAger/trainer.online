# trainer.online frontend

## Конфигурация

По пути `src/configs/settings.json` можно настраивать различные параметры проекта

1. apiUrl - Url на бэкенд проекта `trainer.online.server`.

## Develop

1. Выгрузить проект с репозитория;
2. Скачать зависимости ``` yarn install ```;
3. Запустить режим разработки ``` yarn serve ```;
4. Открыть проект можно по ссылке [localhost:80](http://localhost:80).

## Production

1. Выгрузить проект с репозитория;
2. Скачать зависимости ``` yarn install ```;
3. Собрать проект ``` yarn build ```;
4. Будет создана папка `dist`, в которой и будет находится проект для продакшена;
5. Развернуть контейнер ``` docker-compose up ```;
6. Открыть проект можно по ссылке [localhost:80](http://localhost:80). 