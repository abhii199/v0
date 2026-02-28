'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'
import { Form, FormField } from './ui/form'
import TextAreaAutosize from 'react-textarea-autosize'
import { Kbd } from './ui/kbd'
import { Button } from './ui/button'
import { ArrowUpIcon } from 'lucide-react'

const formSchema = z.object({
  content: z.string()
    .min(1, "Project description is required")
    .max(1000, "Project description is too long")
})



const PromptInputBox = () => {
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ""
    }
  })

  const onSubmit = async (values) => {
    try {
      console.log(values)
    } catch (error) {

    }
  }


  return (
    <div className="space-y-8">
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all", isFocused && "shadow-lg ring-2 ring-primary/20")}
        >
          <FormField
            control={form.control}
            name="content"
            render={(field) => (
              <TextAreaAutosize
                {...field}
                placeholder='Describle what you want to build...'
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={3}
                maxRows={8}
                className={cn('pt-4 resize-none border-none w-full outline-none bg-transparent',
                  // isPending && 'opacity-50'
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault()
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className="flex gap-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <Kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;</span>Enter
              </Kbd>
              &nbsp; to submit
            </div>
            <Button
              className={cn('size-8 rounded-full')}
              type='submit'
            >
              <ArrowUpIcon className='size-4' />
            </Button>
          </div>

        </form>
      </Form>

    </div >
  )
}

export default PromptInputBox