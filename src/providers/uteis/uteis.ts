import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';

@Injectable()

export class UteisProvider {

  constructor(public platform: Platform, public geolocation: Geolocation, public translateService: TranslateService) {
  }

  //Ações
  validarUrl(url: string): boolean {
    if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
      return true;
    }
    else {
      return false;
    }
  }

  //Retornos
  retornarIonicDateTime(data: string): string {
    if (data && data != null) {
      let _data: Date = new Date(data + '-00:00');

      let _ionicData = new Date(_data.getFullYear(), _data.getMonth(), _data.getDate(), _data.getHours(), _data.getMinutes(), _data.getSeconds(), _data.getMilliseconds());
      //let _ionicData = new Date(Date.UTC(_data.getFullYear(), _data.getMonth(), _data.getDate(), _data.getHours(), _data.getMinutes(), _data.getSeconds(), _data.getMilliseconds()));
      
      return _ionicData.toISOString();
    }
    return null;
  }

  retornarDataApi(data: string, offline?: boolean): string {
    if (data && data != 'null' && (data.indexOf("T") >= 0 || offline)) {
      let _data: Date = new Date(data);

      let _apiData = `${_data.getUTCFullYear()}-${this.retornarZerosData(this.retornarMes(_data.getUTCMonth()))}-${this.retornarZerosData(_data.getUTCDate())}`;
      return _apiData;
    }
    return data;
  }

  retornarHoraApi(data: string, offline?: boolean): string {
    if (data && data != 'null' && (data.indexOf("T") >= 0 || offline)) {
      //let _data: Date = new Date(data);

      let _horas: string = data.split(":")[0];
      let _minutos: string = data.split(":")[1];
      let _segundos: string = "00";

      let _apiHora = `${this.retornarZerosData(_horas)}:${this.retornarZerosData(_minutos)}:${this.retornarZerosData(_segundos)}`;
      return _apiHora;
    }
    return data;
  }

  retornarDataHoraApi(data: string): string {
    if (data && data != 'null' && (data.indexOf("T") >= 0)) {
      let _data: Date = new Date(data);

      let _apiData = `${_data.getUTCFullYear()}-${this.retornarZerosData(this.retornarMes(_data.getUTCMonth()))}-${this.retornarZerosData(_data.getUTCDate())} ${this.retornarZerosData(_data.getUTCHours())}:${this.retornarZerosData(_data.getUTCMinutes())}:${this.retornarZerosData(_data.getUTCSeconds())}`;
      return _apiData;
    }
    return data;
  }

  retornarDataSqlite(data: string, hora: string) {
    return data && hora ? `${data}T${hora}` : data ? `${data}T00:00:00` : '';
  }

  retornarMes(mes: number): number {
    if (mes < 12) {
      return mes + 1;
    }
    return 1;
  }

  retornarZerosData(valor: any) {
    return ("0" + valor).slice(-2)
  }

  retornarQueryString(nome: string, url: string): string {
    nome = nome.replace(/[\[\]]/g, "\\$&");
    var _regex = new RegExp("[?&]" + nome + "(=([^&#]*)|&|#|$)"), _results = _regex.exec(url);

    if (!_results)
      return null;

    if (!_results[2])
      return '';

    return decodeURIComponent(_results[2].replace(/\+/g, " "));
  }

  retornarGeolocalizacao() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((data) => {
        resolve(data);
      }).catch((e) => {
        console.log(e);
        resolve(null);
      });
    });
  }

  retornarTextoTraduzido(chave: string): string {
    let _valor: string;

    this.translateService.get(chave).subscribe(
      valor => {
        _valor = valor;
      }
    )

    return _valor;
  }
}
