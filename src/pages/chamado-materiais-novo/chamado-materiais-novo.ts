import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ChamadosProvider } from '../../providers/chamados/chamados';
import { ConfigLoginProvider } from '../../providers/config-login/config-login';
import { AlertsProvider } from '../../providers/alerts/alerts';
import { OfflineProvider } from './../../providers/offline/offline';
import { ConstantesProvider } from './../../providers/constantes/constantes';
import { UteisProvider } from './../../providers/uteis/uteis';

@IonicPage({name: 'ChamadoMateriaisNovoPage'})
@Component({
  selector: 'page-chamado-materiais-novo',
  templateUrl: 'chamado-materiais-novo.html',
  providers: [
    ChamadosProvider,
    ConfigLoginProvider,
    AlertsProvider,
    OfflineProvider,
    ConstantesProvider,
    UteisProvider]
})
export class ChamadoMateriaisNovoPage {
  //Propriedades
  chamadoId: string;
  username: string;
  portal: string;
  idioma: string;
  opcoesTiposServico: any;
  opcoesMarcasMaterial: any;
  opcoesModelosMaterial: any;
  modelo: any;
  respostaApi: any;
  materiaisForm: FormGroup;
  aplicacoes: AbstractControl;
  marcas: AbstractControl;
  modelos: AbstractControl;
  quantidade: AbstractControl;

  //Load
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public chamadosProvider: ChamadosProvider, public configLoginProvider: ConfigLoginProvider, public formBuilder: FormBuilder,
    public alertsProvider: AlertsProvider, public renderer: Renderer, public offlineProvider: OfflineProvider,
    public app: App, public uteisProvider: UteisProvider, public constantesProvider: ConstantesProvider) {
    this.carregarDados();
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
  }

  //Ações
  carregarDados() {
    try {
      if (this.offlineProvider.validarInternetOffline()) {
        this.app.getRootNav().setRoot("HomeOfflinePage");
      }
      else {
        let _configLoginProvider = JSON.parse(this.configLoginProvider.retornarConfigLogin());
        let _configLoginIdiomasProvider = JSON.parse(this.configLoginProvider.retornarConfigLoginIdiomas());

        if (_configLoginProvider) {
          this.materiaisForm = this.formBuilder.group({
            aplicacoes: ['', Validators.compose([Validators.required])],
            marcas: ['', Validators.compose([Validators.required])],
            modelos: ['', Validators.compose([Validators.required])],
            quantidade: ['', Validators.compose([Validators.required])]
          });

          this.aplicacoes = this.materiaisForm.controls['aplicacoes'];
          this.marcas = this.materiaisForm.controls['marcas'];
          this.modelos = this.materiaisForm.controls['modelos'];
          this.quantidade = this.materiaisForm.controls['quantidade'];

          this.portal = _configLoginProvider.portal;
          this.username = _configLoginProvider.username;
          this.idioma = _configLoginIdiomasProvider.valor;
          this.chamadoId = this.navParams.get("ChamadoID");

          this.carregarTiposServico();
          this.carregarMarcasMaterial();
        }
        else {
          this.app.getRootNav().setRoot("LoginPage");
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarTiposServico() {
    try {
      this.chamadosProvider.retornarTiposServico(this.portal).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesTiposServico = _objetoRetorno;
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarMarcasMaterial() {
    try {
      this.chamadosProvider.retornarMarcasMaterial(this.portal).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesMarcasMaterial = _objetoRetorno;
        }, e => {
          console.log(e);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  carregarModelosMaterial(marca: any) {
    try {
      this.modelo = null;
      this.opcoesModelosMaterial = null;
      this.modelos.setValue('');

      this.chamadosProvider.retornarModelosMaterial(this.portal, marca).subscribe(
        data => {
          let _resposta = (data as any);
          let _objetoRetorno = JSON.parse(_resposta._body);

          this.opcoesModelosMaterial = _objetoRetorno;

          if (!this.opcoesModelosMaterial[0]) {
            this.opcoesModelosMaterial = null
          }
        }, e => {
          console.log(e);
          this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
          this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
          this.opcoesModelosMaterial = null;
        });
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.opcoesModelosMaterial = null;
    }
  }

  carregarValoresModelo(modelo: string) {
    try {
      if (modelo) {
        this.chamadosProvider.retornarValoresModelo(this.portal, modelo).subscribe(
          data => {
            let _resposta = (data as any);

            let _objetoRetorno = JSON.parse(_resposta._body);

            this.modelo = _objetoRetorno;

            if (!this.modelo) {
              this.modelo = null;
            }
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
            this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.modelo = null;
          });
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.modelo = null;
    }
  }

  salvarMaterial() {
    try {
      if (this.materiaisForm.valid) {
        this.alertsProvider.exibirCarregando('');

        let _parametros = {
          ChamadoID: this.chamadoId,
          ModeloMaterialID: this.modelos.value,
          Quantidade: this.quantidade.value,
          TipoServicoID: this.aplicacoes.value
        };

        this.chamadosProvider.salvarMaterial(this.username, this.portal, this.chamadoId, this.idioma, _parametros).subscribe(
          data => {
            let _resposta = (data as any);
            let _objetoRetorno = JSON.parse(_resposta._body);

            this.respostaApi = _objetoRetorno;

            if (this.respostaApi) {
              if (this.respostaApi.sucesso) {
                this.navParams.get("ChamadoMateriaisNovoPage").carregarMateriais();
                this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[1]);
                this.navCtrl.pop();
              }
              else {
                this.alertsProvider.exibirToast(this.respostaApi.mensagem, this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
              }
            }
            else {
              this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
              this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            }

            this.alertsProvider.fecharCarregando();
          }, e => {
            console.log(e);
            this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
            this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
            this.alertsProvider.fecharCarregando();
          });
      }
      else {
        this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErroCampos), this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      }
    }
    catch (e) {
      console.log(e);
      this.alertsProvider.exibirToast(this.uteisProvider.retornarTextoTraduzido(this.constantesProvider.chaveMsgErro), 
      this.alertsProvider.msgBotaoPadrao, this.alertsProvider.alertaClasses[0]);
      this.alertsProvider.fecharCarregando();
    }
  }

  //Eventos
  salvarMaterialClick() {
    this.salvarMaterial();
  }

  marcasChange(marca: any) {
    this.carregarModelosMaterial(marca);
  }

  modelosChange(modelo: any) {
    this.carregarValoresModelo(modelo);
  }

  redimencionarPagina() {
    this.renderer.invokeElementMethod(event.target, 'blur');
  }
}
