let fase=1, pontos=0, moedas=0, vidas=3, pos=0;
let tabuleiro=[], escudo=false, trevo=false, dadoExtra=false;

const el = id => document.getElementById(id);
const cores = ['#FF6B6B','#4ECDC4','#FFD93D','#9B5DE5','#06D6A0','#F4A261'];

function rand(n){return Math.floor(Math.random()*n)}

function gerarTabuleiro(){
  const tamanho = 24 + rand(8); // 24-31 casas
  tabuleiro=[];
  for(let i=0;i<tamanho;i++){
    let tipo='normal';
    if(i===0) tipo='inicio';
    else if(i===tamanho-1) tipo='fim';
    else{
      const r=Math.random();
      if(r<0.12) tipo='bonus';
      else if(r<0.24) tipo='moeda';
      else if(r<0.34) tipo='armadilha';
      else if(r<0.42) tipo='fork';
    }
    tabuleiro.push({tipo,num:i+1,salto:null});
  }
  // adiciona 2 escadas e 2 cobras
  for(let i=0;i<2;i++){
    let a=3+rand(tamanho-10), b=a+4+rand(5);
    if(b<tamanho-1) tabuleiro[a].salto=b;
    let c=8+rand(tamanho-12), d=c-4-rand(4);
    if(d>1) tabuleiro[c].salto=d;
  }
  renderizar();
}

function renderizar(){
  const tab = el('tabuleiro');
  tab.innerHTML='';
  tab.style.gridTemplateColumns = `repeat(6,1fr)`;
  tabuleiro.forEach((casa,i)=>{
    const div=document.createElement('div');
    div.className='casa '+casa.tipo;
    div.style.background=cores[i%cores.length];
    let ico=' ';
    if(casa.tipo==='inicio') ico='🚩';
    else if(casa.tipo==='fim') ico='🏆';
    else if(casa.tipo==='bonus') ico='⭐';
    else if(casa.tipo==='moeda') ico='🪙';
    else if(casa.tipo==='armadilha') ico='⚠️';
    else if(casa.tipo==='fork') ico='🔀';
    else if(casa.salto && casa.salto>i) ico='🪜';
    else if(casa.salto && casa.salto<i) ico='🐍';
    div.innerHTML=`<span class="num">${casa.num}</span>${ico}`;
    if(i===pos){ div.classList.add('ativa'); div.innerHTML+=`<span class="token">🚀</span>`; }
    tab.appendChild(div);
  });
  el('fase').textContent=fase;
  el('pontos').textContent=pontos;
  el('moedas').textContent=moedas;
  el('vidas').textContent='❤️'.repeat(vidas)+'🖤'.repeat(3-vidas);
}

function rolar(){
  el('rolar').disabled=true;
  const valor=1+rand(6);
  el('dado-result').textContent='🎲'.repeat(valor);
  el('mensagem').textContent=`Andou ${valor} casas!`;
  mover(valor);
}

async function mover(passos){
  for(let i=0;i<passos;i++){
    if(pos<tabuleiro.length-1) pos++;
    renderizar();
    await new Promise(r=>setTimeout(r,350));
    const casa=tabuleiro[pos];
    if(casa.salto!==null){
      const sub
