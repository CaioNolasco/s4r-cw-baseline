import { Injectable } from '@angular/core';

@Injectable()
export class UteisProvider {

  constructor() {
  }
  //Ações
  validarUrl(url: string): boolean{
    if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
      return true;
    }
    else{
      return false;
    }
  }

  //Retornos
  retornarIonicDateTime(valor: Date): string {
    if (valor) {
      let _data: Date = new Date(valor);
      let _ionicData = new Date(Date.UTC(_data.getFullYear(), _data.getMonth(), _data.getDate(), _data.getHours(), _data.getMinutes(), _data.getSeconds(), _data.getMilliseconds()));
      return _ionicData.toISOString();
    }
    return null;
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
}
