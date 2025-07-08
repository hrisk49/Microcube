import {signal} from '@angular/core';
import {ButtonActionsModel} from '../models/button.actions.model';

export const ButtonActions = signal<ButtonActionsModel>({
  save: false,
  update: false,
  view: false,
  delete: false,
  exit: false,
  reset: false
});
