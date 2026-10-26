/*
 * 「Model X 工作室」卡片图标（内联 SVG data-URI）
 *
 * 宿主添加组件菜单把 iconUrl 直接塞进 <img src>。插件静态资源没有
 * 独立公开根路径，相对/绝对路径都会 404，因此用 data-URI 内联
 * （同 fat-tools src/assets/toolSwitcherIcon.ts）。
 */

const STUDIO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#14181b"/>
  <path d="M8 29.5 12.2 22h5.4l2.6-4.2h8.2L31.2 22H38L42 29.5v4.2H8v-4.2z" fill="#c0d3e1"/>
  <path d="M18.4 22.2h11.4l-2.1-3.2h-7.2l-2.1 3.2z" fill="#14181b" opacity=".55"/>
  <circle cx="16" cy="33.2" r="3.1" fill="#14181b" stroke="#c0d3e1" stroke-width="1.6"/>
  <circle cx="33" cy="33.2" r="3.1" fill="#14181b" stroke="#c0d3e1" stroke-width="1.6"/>
</svg>`;

export const STUDIO_ICON_URL = `data:image/svg+xml;utf8,${encodeURIComponent(STUDIO_SVG)}`;
