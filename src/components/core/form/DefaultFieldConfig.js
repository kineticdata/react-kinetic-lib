import { Map } from 'immutable';
import { AttributesField } from './AttributesField';
import { CheckboxField } from './CheckboxField';
import { TeamField } from './TeamField';
import { TeamsField } from './TeamsField';
import { SelectField } from './SelectField';
import { TextField } from './TextField';
import { TextMultiField } from './TextMultiField';

export const DefaultFieldConfig = Map({
  attributes: AttributesField,
  checkbox: CheckboxField,
  team: TeamField,
  teams: TeamsField,
  select: SelectField,
  text: TextField,
  'text-multi': TextMultiField,
});
