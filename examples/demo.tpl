{if data.sold}
<div><p>i am {{ data.name}}</p><div>
{each data.items}
<p>fruit name: {{item.name}}, fruit price: {{ item.price }}</p>
{/each}
</div></div>
{/if}