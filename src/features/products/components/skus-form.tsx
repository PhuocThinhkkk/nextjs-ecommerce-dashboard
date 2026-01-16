'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/forms/form-input';

export function SkusForm({ form, fieldArray }: { form: any; fieldArray: any }) {
  const { fields, append, remove } = fieldArray;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        {fields.map((field: any, index: number) => (
          <div key={field.id} className='grid grid-cols-4 items-end gap-4'>
            <input type='hidden' {...form.register(`skus.${index}.id`)} />
            <FormInput
              control={form.control}
              name={`skus.${index}.color_attribute`}
              label='Color'
            />

            <FormInput
              control={form.control}
              name={`skus.${index}.size_attribute`}
              label='Size'
            />

            <FormInput
              control={form.control}
              name={`skus.${index}.price`}
              label='Price'
              type='text'
              min={0}
            />

            <Button
              type='button'
              variant='destructive'
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button
          type='button'
          variant='outline'
          onClick={() =>
            append({
              color_attribute: 'name color',
              size_attribute: 'name attribute',
              price: 0
            })
          }
        >
          + Add Variant
        </Button>
      </CardContent>
    </Card>
  );
}
