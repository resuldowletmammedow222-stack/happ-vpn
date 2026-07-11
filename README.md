[![Platform](https://img.shields.io/badge/Platform-%20Android%20%7C%20Android%20TV%20%7C%20iOS%20%7C%20macOS%20%7C%20Windows%20%7C%20Linux-informational.svg)](https://github.com/LXST-CODE/v2RayTun/wiki/home)
[![Android](https://img.shields.io/badge/Android-7%2B-informational.svg)](https://developer.android.com/about/versions/nougat)
[![iOS](https://img.shields.io/badge/iOS-16.0%2B-informational.svg)](https://go.dev/wiki/MinimumRequirements)
[![macOS](https://img.shields.io/badge/macOS-13.0%2B-informational.svg)](https://go.dev/wiki/MinimumRequirements)
[![Windows](https://img.shields.io/badge/Windows-10%2B-informational.svg)](https://docs.flutter.dev/reference/supported-platforms)
[![Arch](https://img.shields.io/badge/Arch-x64-informational.svg)](https://go.dev/wiki/MinimumRequirements)
[![Chat on Telegram](https://img.shields.io/badge/Chat%20on-Telegram-lightgray.svg)](https://t.me/v2raytun)

# v2RayTun — Proxy Client

**v2RayTun** — современный кроссплатформенный proxy-клиент, построенный на основе [Xray Core](https://github.com/XTLS/Xray-core). Приложение предназначено для управления сетевыми подключениями и поддерживает широкий набор платформ, включая **Android**, **Android TV**, **iOS**, **macOS**, **Windows** и **Linux**.

> Этот репозиторий служит официальным центром информации о проекте: здесь размещаются сведения о релизах, обновлениях, известных проблемах, предложениях пользователей и технических особенностях отдельных платформ.

---

## Releases

Актуальные версии приложений, файлы сборок и история изменений доступны через:

* [Telegram Releases](https://t.me/v2raytun/3)
* [GitHub Releases](https://github.com/LXST-CODE/v2RayTun/releases)

Приложение также распространяется через официальные магазины:

* [Google Play](https://play.google.com/store/apps/details?id=com.v2raytun.android)
* [App Store](https://apps.apple.com/us/app/v2raytun/id6476628951)

> [!NOTE]
> Версия приложения для App Store временно недоступна в регионе RU.

---

## Usage

> [!WARNING]
> **v2RayTun** не включает собственные VPN-сервисы, готовые прокси, встроенные подписки или предварительно созданные конфигурации.

Для использования приложения необходимо вручную импортировать собственные настройки подключения или ссылки подписок.

После добавления конфигураций пользователь получает возможность управлять соединениями и выбирать необходимые параметры работы сети.

---

## Independent release tracks

**v2RayTun** использует независимые циклы разработки и публикации для различных платформ.

Общая версия проекта между всеми системами не применяется — каждая платформа может иметь отдельную нумерацию, сроки выхода обновлений и собственные особенности реализации.

| Release track       | Platforms           | Codebase       | Notes                                                                                                          |
| ------------------- | ------------------- | -------------- | -------------------------------------------------------------------------------------------------------------- |
| Android             | Android, Android TV | Kotlin         | Единая кодовая база с отдельными интерфейсами, адаптацией под Android TV и дополнительными ресурсами платформы |
| Desktop             | Windows, Linux      | Flutter / Dart | Общий исходный код с различными вариантами сборки, упаковки и требованиями для разных систем                   |
| iOS                 | iOS, iPadOS         | Swift          | Самостоятельное направление разработки с отдельным процессом публикации через App Store                        |
| macOS Apple Silicon | macOS M2+           | Swift          | Специальные сборки для устройств с процессорами Apple Silicon                                                  |
| macOS Intel         | macOS Intel         | Swift          | Отдельная ветка для компьютеров Mac на базе Intel                                                              |

---

## Roadmap

[Public Roadmap](https://github.com/users/LXST-CODE/projects/1) поддерживается через систему **GitHub Projects**.

В дорожной карте публикуются:

* планы дальнейшего развития;
* будущие функции и улучшения;
* известные ограничения;
* задачи, связанные с подготовкой релизов;
* предложения сообщества и решения по ним.

---

## Issues and feedback

Раздел **GitHub Issues** предназначен для:

* сообщений о найденных ошибках;
* предложений новых возможностей;
* обсуждения проблем совместимости;
* рекомендаций по улучшению проекта.

Перед созданием нового обращения рекомендуется использовать доступные шаблоны.

---

## Languages

Русскоязычные пояснения могут добавляться в отдельных разделах для удобства пользователей.

При этом основная документация, структура репозитория и организация материалов проекта остаются на английском языке.