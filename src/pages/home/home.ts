import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AlertsProvider } from '../../providers/alerts/alerts';
import { ConfigLoginProvider } from './../../providers/config-login/config-login';
import { UsuariosProvider } from './../../providers/usuarios/usuarios';
import { ChamadosProvider } from './../../providers/chamados/chamados';
import { UteisProvider } from './../../providers/uteis/uteis';

import { LoginPage } from './../login/login';
import { ChamadoHistoricoPage } from './../chamado-historico/chamado-historico';
import { ChamadoDetalhesPage } from './../chamado-detalhes/chamado-detalhes';
import { ChamadosEquipamentoPage } from './../chamados-equipamento/chamados-equipamento';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    BarcodeScanner,
    ConfigLoginProvider,
    ChamadosProvider,
    UsuariosProvider,
    AlertsProvider,
    UteisProvider,
    InAppBrowser
  ]
})
export class HomePage {
  //Propriedades
  username: string;
  portal: string;
  nomePortal: string;
  msgNenhumItem: string;
  filtroEquipamento: string;
  filtroNomeEquipamento: string;
  qrCodeUrl: string;
  search: any;
  chamados: any;
  chamado: any;
  refresher: any;
  infiniteScroll: any;
  exibirMsg: boolean = false;
  exibirSearch: boolean = false;
  isRefreshing: boolean = false;
  pagina = 1;
  tamanhoPagina = 20;

  //Load
  constructor(public navCtrl: NavController, public configLoginProvider: ConfigLoginProvider, public chamadosProvider: ChamadosProvider,
    public usuariosProvider: UsuariosProvider, public alertsProvider: AlertsProvider, public barcodeScanner: BarcodeScanner,
    public uteisProvider: UteisProvider, public inAppBrowser: InAppBrowser) {
    this.navCtrl = navCtrl;
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.carregarChamados();
  }

  //Ações
  carregarDados() {
    try {
      let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());

      if (_configLoginProvider) {
        this.username = _configLoginProvider.username;
        this.nomePortal = _configLoginProvider.nomePortal;
        this.portal = _configLoginProvider.portal;
        this.msgNenhumItem = this.alertsProvider.msgNenhumItem;
        this.exibirMsg = false;
      }
      else {
        this.navCtrl.push(LoginPage);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarChamados(novaPagina: boolean = false) {
    try {
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

      this.exibirMsg = false;

      this.chamadosProvider.retornarChamadosAbertos(this.username, this.portal,
        this.pagina, this.tamanhoPagina).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            if (novaPagina) {
              this.chamados = this.chamados.concat(_objetoRetorno);
              this.infiniteScroll.complete();
            }
            else {
              this.chamados = _objetoRetorno;
            }

            if (!this.chamados[0]) {
              this.exibirMsg = true;
              this.chamados = null;
            }

            this.alertsProvider.fecharCarregando();
          }
        )
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.exibirMsg = true;
      this.chamados = null;
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarDetalhesChamado(valor: string) {
    try {
      this.chamadosProvider.retornarChamadoPorNumeroUsuario(this.username, this.portal, valor).subscribe(
        data => {
          let _resposta = (data as any);

          let _objetoRetorno = JSON.parse(_resposta._body);

          this.chamado = _objetoRetorno;

          if (this.chamado) {
            this.navCtrl.push(ChamadoDetalhesPage, { ChamadoID: this.chamado.ChamadoID });
          }
          else {
            this.alertsProvider.exibirToast(this.alertsProvider.msgNenhumItem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
          }
        }, error => {
          if (error.status == 404) {
            this.alertsProvider.exibirToast(this.alertsProvider.msgNenhumItem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
          }
          else {
            this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }
        }
      )
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarQrCode() {
    try {
      this.filtroEquipamento = null;
      this.filtroNomeEquipamento = null;
      this.qrCodeUrl = null;

      this.barcodeScanner.scan().then(barcodeData => {

        let _valor = barcodeData.text;

        if (_valor) {
          this.filtroEquipamento = this.uteisProvider.retornarQueryString("v", _valor);
          this.filtroNomeEquipamento = this.uteisProvider.retornarQueryString("v1", _valor);
          this.qrCodeUrl = _valor;

          let _botoes: any = [{ text: this.alertsProvider.msgBotaoNavegar, handler: this.navegarClick },
          { text: this.alertsProvider.msgBotaoFiltrar, handler: this.filtrarClick },
          { text: "Cancelar" }]

          this.alertsProvider.exibirAlertaConfirmacaoHandler(this.alertsProvider.msgTituloPadrao, this.alertsProvider.msgEscolhaAcao, _botoes);
        } 
      });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  navegarQrCode() {
    try {
      if (this.uteisProvider.validarUrl(this.qrCodeUrl)) {
        this.inAppBrowser.create(this.qrCodeUrl, '_system')
      }
      else {
        this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  filtrarQrCode() {
    try {
      if (this.filtroEquipamento) {
        this.navCtrl.push(ChamadosEquipamentoPage, { EquipamentoID: this.filtroEquipamento, NomeEquipamento: this.filtroNomeEquipamento });
      }
      else {
        this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  
  //Eventos
  logoutClick() {
    this.usuariosProvider.logoutUsuario();
  }

  searchClick() {
    this.search = "";
    this.exibirSearch = !this.exibirSearch;
  }

  atualizarClick() {
    this.carregarChamados();
  }

  abrirDetalhesClick(chamado) {
    this.navCtrl.push(ChamadoDetalhesPage, { ChamadoID: chamado.ChamadoID });
  }

  historicoClick(chamado) {
    this.navCtrl.push(ChamadoHistoricoPage, { ChamadoID: chamado.ChamadoID });
  }

  qrCodeClick() {
    this.carregarQrCode();
  }

  navegarClick = () => {
    this.navegarQrCode();
  }

  filtrarClick = () => {
    this.filtrarQrCode();
  }

  buscarChamados(evento: any) {
    let _valor = evento.target.value;

    this.carregarDetalhesChamado(_valor);
  }

  doRefresh(refresher) {
    this.pagina = 1;
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarChamados();

    if (this.isRefreshing) {
      this.refresher.complete();
      this.isRefreshing = false;
    }
  }

  doInfinite(infiniteScroll) {
    this.pagina++;
    this.infiniteScroll = infiniteScroll;

    this.carregarChamados(true);
  }
}


// qrCodeClick() {
  //   let qrCode = 'https://cushwake1.sharepoint.com/:f:/r/sites/SAGE-AGUABRANCA/Shared%20Documents/SAGE%20-%20%C3%81GUA%20BRANCA/El%C3%A9trica/002QDF0203ELEAGB?v=3&v1=Ar Condicionado';
  //   this.filtroEquipamento = null;
  //   this.filtroNomeEquipamento = null;
  //   this.qrCodeUrl = null;

  //   try { 
  //     if (qrCode) {
  //       this.filtroEquipamento = this.uteisProvider.retornarQueryString("v", qrCode);
  //       this.filtroNomeEquipamento = this.uteisProvider.retornarQueryString("v1", qrCode);
  //       this.qrCodeUrl = qrCode;

  //       let _botoes: any = [{ text: this.alertsProvider.msgBotaoNavegar, handler: this.navegarClick },
  //                           { text: this.alertsProvider.msgBotaoFiltrar, handler: this.filtrarClick  },  
  //                           { text: "Cancelar"  }] 

  //       this.alertsProvider.exibirAlertaConfirmacaoHandler(this.alertsProvider.msgTituloPadrao, this.alertsProvider.msgEscolhaAcao, _botoes);
  //     }
  //     else{
  //       this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
  //     }
  //   }
  //   catch (e) {
  //     this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
  //   }
  // }