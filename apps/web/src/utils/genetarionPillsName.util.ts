import { ProductsListParams } from 'types/types';
import { z } from 'zod';

const schema = z.object({
  value: z.string(),
  key: z.string(),
});

type PillTypes = z.infer<typeof schema>[];

export default function generationPillsName(pills: ProductsListParams): PillTypes {
  const values = Object.values(pills);
  const keys = Object.keys(pills);
  const pillsArr = [];

  for (let i = 1; i < values.length; i += 1) {
    switch (keys[i]) {
      case 'searchValue': if (values[i]) pillsArr.push({ key: 'searchValue', value: values[i] });
        break;
      case 'price':
        if (values[i].from && values[i].to) pillsArr.push({ key: 'price', value: `$${values[i].from}-$${values[i].to}` });
        if (values[i].from && !values[i].to) pillsArr.push({ key: 'price', value: `From $${values[i].from}` });
        if (!values[i].from && values[i].to) pillsArr.push({ key: 'price', value: `Up to $${values[i].to}` });
        break;
      /* eslint-disable */
      default: '';
    }
  }

  return pillsArr;
}
