import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Content } from 'ionic-angular';
import { Renderer } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { TabsPage } from './../tabs/tabs';

import { UsuariosProvider } from './../../providers/usuarios/usuarios';
import { AlertsProvider } from './../../providers/alerts/alerts';
import { ConfigLoginProvider } from './../../providers/config-login/config-login';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [
    BarcodeScanner,
    ConfigLoginProvider,
    AlertsProvider,
    UsuariosProvider
  ]
})
export class LoginPage {
  //Propriedades
  @ViewChild(Content) content: Content;
  portais: any;
  opcoesPortais: any;

  loginForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    public configLoginProvider: ConfigLoginProvider, public alertsProvider: AlertsProvider,
    public usuariosProvider: UsuariosProvider, public barcodeScanner: BarcodeScanner, public renderer: Renderer) {
    this.navCtrl = navCtrl;
    this.carregarDados();
  }

  ionViewDidLoad() {
  }

  //Ações
  carregarDados() {
    try {
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.required])]
      });

      this.username = this.loginForm.controls['username'];
      this.password = this.loginForm.controls['password'];

      this.carregarOpcoesPortais();
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarOpcoesPortais() {
    try {
      let _configLoginProvider = this.configLoginProvider.retornarConfigLoginPortais();

      if (_configLoginProvider) {
        this.opcoesPortais = JSON.parse(_configLoginProvider);

        if (this.opcoesPortais) {
          this.portais = this.opcoesPortais[0].valor;
        }
      }
      else {
        this.opcoesPortais = null;
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarUsuarioAutenticacao() {
    try {
      this.alertsProvider.exibirCarregando(this.alertsProvider.msgAguarde);

      this.usuariosProvider.retornarUsuarioAutenticado(this.username.value, this.password.value, this.portais).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          if (_objetoRetorno.autenticacao) {
            let _valorPortal = this.portais;
            let _nomePortal = this.opcoesPortais.find(function (item) { return item.valor == _valorPortal });

            this.configLoginProvider.salvarConfigLogin(this.username.value, this.password.value, this.portais, _nomePortal.texto);
            this.navCtrl.setRoot(TabsPage);
          }
          else {
            this.alertsProvider.exibirToast(_objetoRetorno.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          }

          this.alertsProvider.fecharCarregando();

        }
      )
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  carregarQrCode() {
    try {
      this.barcodeScanner.scan().then(barcodeData => {

        let _valor = barcodeData.text;

        if (_valor) {
          let _portaisQrCode = JSON.parse(_valor);

          if (_portaisQrCode.valor && _portaisQrCode.texto) {
            this.configLoginProvider.salvarConfigLoginPortais(_portaisQrCode.valor, _portaisQrCode.texto);
          }
          else {
            this.alertsProvider.exibirToast(this.alertsProvider.msgNenhumItem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
          }
        }
        else {
          this.alertsProvider.exibirToast(this.alertsProvider.msgNenhumItem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[2]);
        }

        this.carregarOpcoesPortais();
      });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
    }
  }

  limparPortais() {
    try {
      let _botoes = [{ text: this.alertsProvider.msgBotaoCancelar },
      { text: this.alertsProvider.msgBotaoConfirmar, handler: this.confirmarClick }]

      this.alertsProvider.exibirAlertaConfirmacaoHandler(this.alertsProvider.msgTituloPadrao, this.alertsProvider.msgConfirmacao, _botoes);
    }
    catch (e) {
      console.log(e);
    }
  }

  confirmarLimparPortais() {
    try {
      localStorage.removeItem("configLoginPortais");

      this.alertsProvider.exibirToast(this.alertsProvider.msgSucesso, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);

      this.carregarOpcoesPortais();
    }
    catch (e) {
      console.log(e);
    }
  }

  //Eventos
  loginClick() {
    if (this.loginForm.valid) {
      this.carregarUsuarioAutenticacao();
    }
  }

  qrCodeClick() {
    this.carregarQrCode();
  }

  limparClick() {
    this.limparPortais();
  }

  confirmarClick = () => {
    this.confirmarLimparPortais();
  }

  redimencionarPagina(){
    this.renderer.invokeElementMethod(event.target, 'blur');
    //this.content.resize();
  }

  // qrCodeClick() {
  //   let qrCode = '{"valor":"PortalBancoPan","texto":"Portal Banco Pan"}';

  //   try { 
  //     if (qrCode) {
  //       let _portaisQrCode = JSON.parse(qrCode);
  //       this.configLoginProvider.salvarConfigLoginPortais(_portaisQrCode.valor, _portaisQrCode.texto);
  //     }
  //   }
  //   catch (e) {
  //     this.alertsProvider.exibirToast(this.alertsProvider.msgErro, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
  //   }

  //   this.carregarOpcoesPortais();
  // }

  //opcoesPortaisChange(): void {
  //let portal = this.portais;
  //}
}
