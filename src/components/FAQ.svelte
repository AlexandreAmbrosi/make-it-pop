<script lang="ts">
  /*
    A component that can be used anywhere in your app

    Use anywhere in your app like the following:

    <FAQ
      data={
        [
          { question: `Hey, who's this?`, answer: `It's me, ma!` },
          { question: `Hey, who's this agan?`, answer: `Hey ma, it's me again!` }
        ]
      }
    />
  */

  import PlusIcon from '~icons/mdi/plus'
  import MinusIcon from '~icons/mdi/minus'
  import faqs from '@/lib/data/faqs'
  import { slug } from 'github-slugger'

  interface FAQProps {
    question: string
    answer: string
    labelID?: string
    viewID?: string
  }

  interface Props {
    data?: FAQProps[]
  }

  let { data = $bindable(faqs) }: Props = $props()

  data.forEach((i, _) => {
    data[_]['labelID'] = slug(i['question'])
    data[_]['viewID'] = 'view-' + data[_]['labelID']
  })
</script>

<section id="faq">
  <div class="mx-auto flex max-w-7xl flex-col gap-8 px-8 py-24">
    <div class="flex flex-col text-left">
      <p class="text-base-content text-launchfast text-3xl font-extrabold sm:text-4xl">Questions and Answers</p>
    </div>
    <ul class="basis-1/2">
      {#each data as i}
        <li class="group">
          <div class="border-base-content/10 relative flex w-full cursor-pointer items-center gap-2 border-t py-5 text-left text-base font-semibold md:text-lg">
            <span class="text-base-content flex-1 font-medium">{i.question}</span>
            <div id={`icon-minus-${i.labelID}`} class="ml-auto hidden h-4 w-4 shrink-0 fill-current">
              <MinusIcon />
            </div>
            <div id={`icon-plus-${i.labelID}`} class="ml-auto block h-4 w-4 shrink-0 fill-current">
              <PlusIcon />
            </div>
          </div>
          <input class="hidden" type="checkbox" id={i.labelID} />
          <div id={i.viewID} class="mb-5 overflow-hidden whitespace-pre-line">
            {i.answer}
          </div>
        </li>
      {/each}
      <div class="text-base-content/80 border-t pt-4">
        Got more? Send me a DM on
        <a class="text-base-content border-launchfast border-b" target="_blank" href="https://twitter.com/rishi_raj_jain_">Twitter</a>
        or by
        <a href="mailto:jain71000@gmail.com" target="_blank" class="text-base-content border-launchfast border-b">email</a>.
      </div>
    </ul>
  </div>
</section>
