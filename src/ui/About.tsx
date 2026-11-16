import { useStore } from '../state/store';

export function About({ onClose }: { onClose: () => void }) {
  const lang = useStore((st) => st.lang);
  const atlas = useStore((st) => st.atlas);
  const zh = lang === 'zh';
  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="about" onClick={(e) => e.stopPropagation()}>
        <button className="card-close" onClick={onClose}>
          ×
        </button>
        <h2>Orbis · 寰宇时序</h2>
        <p>
          {zh
            ? '一部开源的三维世界历史地图，涵盖欧洲、非洲与亚洲近两千年的疆域、朝代、战争、人物与地名沿革。'
            : 'An open-source 3D historical atlas of Europe, Africa and Asia across two thousand years: borders, dynasties, wars, people and the genealogy of place names.'}
        </p>
        {atlas && (
          <p className="muted">
            {atlas.events.length} {zh ? '个事件' : 'events'} · {atlas.people.length} {zh ? '位人物' : 'people'} · {atlas.places.length} {zh ? '处地名' : 'places'} ·{' '}
            {atlas.polities.length} {zh ? '个政权' : 'polities'} · {zh ? '数据生成于' : 'data built'} {atlas.generated}
          </p>
        )}
        <h4>{zh ? '数据来源' : 'Data sources'}</h4>
        <ul>
          <li>
            <a href="https://github.com/aourednik/historical-basemaps" target="_blank" rel="noreferrer">
              historical-basemaps
            </a>{' '}
            — {zh ? '世界历史疆域快照（GPL-3.0），边界为近似复原' : 'world border snapshots (GPL-3.0); borders are approximate'}
          </li>
          <li>
            <a href="https://github.com/DeanChensj/jiangshan-map" target="_blank" rel="noreferrer">
              江山时序 jiangshan-map
            </a>{' '}
            — {zh ? '中国部分的朝代、事件、人物行迹与地名（GPL-3.0）' : 'China: dynasties, events, journeys and place genealogy (GPL-3.0)'}
          </li>
          <li>
            <a href="https://www.wikidata.org" target="_blank" rel="noreferrer">
              Wikidata
            </a>{' '}
            — {zh ? '日期、坐标与图像的规范来源（CC0），每条记录均与之比对' : 'canonical dates, coordinates and images (CC0); every record is diffed against it'}
          </li>
          <li>
            <a href="https://commons.wikimedia.org" target="_blank" rel="noreferrer">
              Wikimedia Commons
            </a>{' '}
            — {zh ? '图片（各自许可证见图片说明）' : 'images (license and author shown under each image)'}
          </li>
          <li>{zh ? 'NASA Blue Marble 地表纹理（公有领域）' : 'NASA Blue Marble earth texture (public domain)'}</li>
        </ul>
        <h4>{zh ? '操作' : 'Controls'}</h4>
        <ul className="keys">
          <li>
            <kbd>⌘K</kbd> / <kbd>/</kbd> {zh ? '搜索' : 'search'}
          </li>
          <li>
            <kbd>Space</kbd> {zh ? '播放 / 暂停' : 'play / pause'}
          </li>
          <li>
            <kbd>←</kbd> <kbd>→</kbd> {zh ? '上 / 下一个大事年份或行程站点' : 'previous / next event year or journey stop'} (<kbd>Shift</kbd> ±10)
          </li>
          <li>
            <kbd>Esc</kbd> {zh ? '关闭' : 'close'}
          </li>
        </ul>
        <p className="muted small">
          {zh ? '音乐为浏览器实时合成，每个地区一种调式与音色。' : 'Music is synthesised live in the browser: one mode and timbre per region.'}{' '}
          <a href="https://github.com/tuye0305/orbis-atlas" target="_blank" rel="noreferrer">
            GitHub
          </a>{' '}
          · GPL-3.0
        </p>
      </div>
    </div>
  );
}
