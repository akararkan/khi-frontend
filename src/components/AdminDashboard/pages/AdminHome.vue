<template>
  <div class="wrap">
    <h1 class="title">داشبۆرد</h1>
    <p class="sub">بەخێربێیت — لێرە دەستپێدەکەیت.</p>

    <div class="grid">
      <RouterLink class="card" to="/admin/projects"><div class="k">پڕۆژەکان</div><div class="v">لیست / دەستکاری</div></RouterLink>
      <RouterLink class="card" to="/admin/news"><div class="k">هەواڵ</div><div class="v">بڵاوکردنەوە</div></RouterLink>
      <RouterLink class="card" to="/admin/image-collections"><div class="k">کۆمەڵە وێنە</div><div class="v">میدیا</div></RouterLink>
      <RouterLink class="card" to="/admin/writings"><div class="k">نووسراوەکان</div><div class="v">کتێبخانە</div></RouterLink>
    </div>
  </div>
</template>

<style scoped>
.wrap{direction:rtl;max-width:1100px;margin:0 auto}
.title{margin:0 0 .25rem;font-size:1.8rem;font-weight:1000;color:#2E2D29}
.sub{margin:0 0 1rem;color:#767571;font-weight:800}
.grid{display:grid;gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr))}
@media (max-width:780px){.grid{grid-template-columns:1fr}}
.card{display:block;text-decoration:none;background:#fff;border:1px solid #E0DFDC;border-radius:16px;padding:1rem;
  box-shadow:0 12px 34px rgba(0,0,0,.07);transition:.18s ease}
.card:hover{transform:translateY(-2px);box-shadow:0 18px 48px rgba(0,0,0,.10);border-color:rgba(140,21,21,.25)}
.k{font-weight:1000;color:#8C1515;margin-bottom:.25rem}
.v{color:#2E2D29;font-weight:900}
</style>
