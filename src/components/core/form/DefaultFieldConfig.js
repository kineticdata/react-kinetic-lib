import { Map } from 'immutable';
import { AttributesField } from './AttributesField';
import { CheckboxField } from './CheckboxField';
import { PasswordField } from './PasswordField';
import { TeamField } from './TeamField';
import { TeamMultiField } from './TeamMultiField';
import { SelectField } from './SelectField';
import { SelectMultiField } from './SelectMultiField';
import { TextField } from './TextField';
import { TextMultiField } from './TextMultiField';
import { UserField } from './UserField';
import { UserMultiField } from './UserMultiField';

export const DefaultFieldConfig = Map({
  AttributesField,
  CheckboxField,
  PasswordField,
  TeamField,
  TeamMultiField,
  SelectField,
  SelectMultiField,
  TextField,
  TextMultiField,
  UserField,
  UserMultiField,
});
