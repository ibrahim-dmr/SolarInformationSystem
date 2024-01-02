# SIS - Backend  ***Fırat Üniversitesi*** <sub> <img src="https://github.com/Batuhanbyr/Veri-Yapilari-Firat-University/assets/95686987/51d55905-e9c9-4a7d-b0f8-276c039482d3" alt="drawing" width="50"/> </sub> <sub><img src="https://github.com/Batuhanbyr/Veri-Yapilari-Firat-University/assets/95686987/32df2db6-6a8b-452b-975a-a7d6ffdfde57" alt="nasa" width="60"/></sub>

SIS projesinin backend sunucusunun dökümantasyonudur.

# Projenin başlatılması

- ## Geliştirme ortamının oluşturulması

     ### `npm install`

- ## Sunucunun başlatılması

    ### `npm start`

# Projenin Dosya Hiyerarşi

    |-- config
        |-- auth.config.js
        |-- city.config.js
        |-- db.config.js
        |-- ilce.config.js
    |-- controllers
        |-- auth.controller.js
        |-- user.controller.js
    |-- middleware
        |-- authJWT.js
        |-- cityInformation.js
        |-- verifySignUP.js
        |-- index.js
    |-- models
        |-- city.model.js
        |-- role.model.js
        |-- user.model.js
        |-- index.js
    |-- routes
        |-- auth.routes.js
        |-- city.routes.js
        |-- user.routes.js
    |-- index.js
    |-- package.json
    |-- package-lock.json
    |-- sehirler.js

## Config
    Projenin arka planında çalışan databaselerin bağlantı verileri tutulmaktadır. 

## Controllers
    Kullanıcı Login olmak istediği zaman girmiş olduğu verileri kontrol etmektedir.

## Middleware
    Kullanıcının API'ler üzerinden yaptığı isteklerin işlenerek geri dönüşleri gerçekleştirir.

## Models
    Database üzerinde yer alacak olan verilerin iskeletidir. Burada oluşturduğumuz iskelet yapı üzerinden veriler Database kayıt edilir.

## Routes
    Sunucu üzerinde API'lerin oluşturulmasını sağlamaktadır. Burada oluşturulan API'ların hangi Middleware tarafından ele alınacağına karar verildiği yerdir. 