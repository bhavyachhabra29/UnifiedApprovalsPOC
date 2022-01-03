import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ApprovalsAceAdaptiveCardExtensionStrings';
import { IApprovalsAceAdaptiveCardExtensionProps, IApprovalsAceAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../ApprovalsAceAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IApprovalsAceAdaptiveCardExtensionProps, IApprovalsAceAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    if(this.state.approvalCount !== 0){
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }
  else
  {
    return null;
  }
  }

  public get data(): IPrimaryTextCardParameters {
    let cardText: string = "";
    if(this.state.approvals.length === 0){
      cardText = "No Approvals";
    } else {
      cardText = this.state.approvals.length.toString() + " Approval(s)";
    }

    return {
      primaryText: cardText,
      description: ""
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}
