import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ApprovalsAcePropertyPane } from './ApprovalsAcePropertyPane';
import {IApproval,IApprovalResponse,IReassignResponse} from '../../models/ApprovalsModels';
import {ApprovalsService} from '../../service/ApprovalsService';

export interface IApprovalsAceAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IApprovalsAceAdaptiveCardExtensionState {
  description: string;
  approvalCount: number;
  approvals: IApproval[];
}

const CARD_VIEW_REGISTRY_ID: string = 'ApprovalsAce_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'ApprovalsAce_QUICK_VIEW';

export default class ApprovalsAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IApprovalsAceAdaptiveCardExtensionProps,
  IApprovalsAceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ApprovalsAcePropertyPane | undefined;
  private approvals: IApproval[] = [];
 

  public onInit(): Promise<void> {

    this.state = {
      description: this.properties.description,
      approvalCount: this.approvals.length,
      approvals: this.approvals
    }; 

    let approvalService:ApprovalsService = new ApprovalsService(this.context);    
    approvalService.getMyApprovals().then((approvals: IApproval[]) => {
      this.approvals=approvals;
      console.log(approvals);
      console.log("length:"+this.approvals.length);

      /*this.state = {
        description: this.properties.description,
        approvalCount: this.approvals.length,
        approvals: this.approvals
      };*/
      
      this.setState({        
        approvalCount: this.approvals.length,
        approvals: this.approvals
      });

    })
    .catch((err: Error) => {
      console.log(err);
    });

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView()); 

    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'ApprovalsAce-property-pane'*/
      './ApprovalsAcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ApprovalsAcePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
