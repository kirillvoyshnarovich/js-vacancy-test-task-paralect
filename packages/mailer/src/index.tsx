import React, { FC } from 'react';
import { Options, renderAsync } from '@react-email/render';

import { EmailComponent, TemplateMailer, TemplateProps } from './template';

export * from './template';

export interface RenderEmailHtmlProps<T extends TemplateMailer> {
  template: T
  params: TemplateProps[T]
  options?: Options
}

export const renderEmailHtml = async <T extends TemplateMailer>({
  template,
  params,
  options,
}: RenderEmailHtmlProps<T>) => {
  const Component = EmailComponent[template] as FC<TemplateProps[T]>;

  return renderAsync(<Component {...params} />, options);
};
