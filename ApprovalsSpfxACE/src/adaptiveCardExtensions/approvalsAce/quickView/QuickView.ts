import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ApprovalsAceAdaptiveCardExtensionStrings';
import { IApprovalsAceAdaptiveCardExtensionProps, IApprovalsAceAdaptiveCardExtensionState } from '../ApprovalsAceAdaptiveCardExtension';
import {IApproval,IApprovalResponse,IReassignResponse} from '../../../models/ApprovalsModels';
import {ApprovalsService} from '../../../service/ApprovalsService';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
  approvals:IApproval[];
}

export class QuickView extends BaseAdaptiveCardView<
  IApprovalsAceAdaptiveCardExtensionProps,
  IApprovalsAceAdaptiveCardExtensionState,
  IQuickViewData
> {
  
  public get data(): IQuickViewData {    
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      description: this.properties.description,
      approvals:this.state.approvals
    };
  }

  public get template(): ISPFxAdaptiveCard {
    let template: ISPFxAdaptiveCard = require('./template/QuickViewTemplate.json');   
    return template;
  }

  public onAction(action: IActionArguments): void {
    try {
      if (action.type === 'Submit') {
        const { id, name } = action.data;
        console.log("name:"+name);
        
        let approvalService:ApprovalsService = new ApprovalsService(this.context); 
        

        if (id === 'approveAction') {
          approvalService.approve(name,"Approved.").then((approvalResponse: IApprovalResponse) => {            
            console.log(approvalResponse.properties);
            let myApprovals:IApproval[]=[];   
            approvalService.getMyApprovals().then((approvals: IApproval[]) => {
              myApprovals=approvals;
              console.log(approvals);
              this.setState({ approvalCount:myApprovals.length, approvals: myApprovals });
            })
            .catch((err: Error) => {
              console.log(err);
            });
          })
          .catch((err: Error) => {
            console.log(err);
          });
          
        }

        else if (id === 'rejectAction') {
          approvalService.reject(name,"Rejected.").then((approvalResponse: IApprovalResponse) => {            
            console.log(approvalResponse.properties);
            let myApprovals:IApproval[]=[];   
            approvalService.getMyApprovals().then((approvals: IApproval[]) => {
              myApprovals=approvals;
              console.log(approvals);
              this.setState({ approvalCount:myApprovals.length, approvals: myApprovals });
            })
            .catch((err: Error) => {
              console.log(err);
            });
          })
          .catch((err: Error) => {
            console.log(err);
          });
          
        }  
                
      }
    } catch (err) {
      console.error(err);      
    }
  }
}