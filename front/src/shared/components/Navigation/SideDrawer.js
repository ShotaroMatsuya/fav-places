import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

// SideDrawerコンポーネントだけはbodyタグ直下に表示させたいのでPortalを用いて指定したDOMにrenderingするように設定する
const SideDrawer = props => {
  const content = (
    //   inにはtrueかfalse、timeoutにはms、classNames(sがつく)には適切なクラス名をセット
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
      //   mountOnEnterはinがtrueになるまでマウントしなかったり、unmountOnExitはexitedになる度アンマウントする為のプロパティです。消える時はアニメーションしなくていいみたいな場合に使うといい感じです。またonEnteredやonExitedなどを渡して完了した時に連動してある処理を行うこともできます。
    >
      <aside className="side-drawer" onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
