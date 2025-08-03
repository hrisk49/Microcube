import {signal} from '@angular/core';
import {ButtonActionsModel} from '../models/button.actions.model';
import {FormGroup} from '@angular/forms';

export const ButtonActions = signal<ButtonActionsModel>({
  save: false,
  update: false,
  view: false,
  delete: false,
  exit: false,
  reset: false
});


export const FormGroupSignal = signal<FormGroup>(new FormGroup({}));
