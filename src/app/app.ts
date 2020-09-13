import { bomberFrames } from '~/assets/loader';
import * as PIXI from 'pixi.js';
import * as PUXI from '@puxi/core/lib/puxi-core.js'
import {GlowFilter, DropShadowFilter} from 'pixi-filters';

interface BomberFrames {
    front: string[];
    back: string[];
    right: string[];
    left:  string[];
}

// Prepare frames
const playerFrames: BomberFrames = bomberFrames;

// IMPORTANT: Change this value in order to see the Hot Module Reloading!
const currentFrame: keyof BomberFrames = 'front';


export class GameApp {
    private app: PIXI.Application;
    private uxStage: PUXI.Stage;
    private graphics: PIXI.Graphics;

    constructor(parent: HTMLElement, width: number, height: number) {

        this.app = new PIXI.Application({
            width,
            height,
            backgroundColor : 0xaaaaaa,
            resolution: 2,
        });

        const puxiStage = this.app.stage.addChild(new PUXI.Stage(width, height));
        
        const btn = new PUXI.Button({
            background: 0xffffff,
            text: "Hello world!",
          });
        btn.setElevation(1).setPadding(200, 0)
        const m = new PUXI.ClickManager(btn)
        m.onPress = (event) => {
            if (event.type === 'mousedown') {
                btn.background.tint = 0xff0000
            } else {
                btn.background.tint = 0xffffff
            }
        }
        const layout = new PUXI.WidgetGroup()
        
        const lll= new PUXI.FastLayout();
        // lll.onMeasure = () => {
        //     console.log('raw')
        // }
        layout.useLayout(lll);
        layout.setBackground(0xffeaff);
        
        btn.setLayoutOptions(new PUXI.FastLayoutOptions({
            width: 250,
            height: PUXI.LayoutOptions.WRAP_CONTENT,
            x: width - 250 - 600,
            y: 280,
        }));

        // cannot run immediately, input will be replaced by pixi canvas
        setTimeout(() => {
            const tin = new PUXI.TextInput({
                background: 0xaa66a5,
                value: '353',
                multiLine: true,
                caretWidth: 4,
                lineHeight: 30,
                padding: 4,
                style: new PIXI.TextStyle({
                    fontSize: 30,
                    fontFamily: 'monospace',
                }),
            });
            tin.stage = puxiStage // focus() will fail without this
            tin.focus()
            const lo = new PUXI.FastLayoutOptions({
                width: 240,
                height: 30 + 4 * 2,
                x: width - 200 - 600,
                y: 60,
            })
            tin.on('keyup', (event) => {
                if (event.which === 13) {
                    if (!event.shiftKey) {
                        // send
                        console.log(tin.value)
                        tin.value = ''
                        tin.setCaretIndex(0);
                        lo.height = (30 * tin.value.split('\n').length) + 4 * 2
                        puxiStage.measureAndLayout()
                    } else {
                        lo.height = (30 * tin.value.split('\n').length) + 4 * 2
                        puxiStage.measureAndLayout()
                    }
                }
                if (event.which === 8) {
                    lo.height = (30 * tin.value.split('\n').length) + 4 * 2
                    puxiStage.measureAndLayout()
                }
            })
            tin.setLayoutOptions(lo)
            puxiStage.addChild(tin)
        }, 0)

        // parent.addChild(child);
        layout.addChild(new PUXI.TextWidget('testwwwwww'));
        layout.addChild(btn);


        const mockScroll = new PUXI.ScrollWidget({
            scrollY: true,
            scrollX: true,
            scrollBars: true,
        }).setLayoutOptions(
            new PUXI.FastLayoutOptions({
                width: PUXI.LayoutOptions.WRAP_CONTENT,
                height: 200,
                x: 0.2,
                y: 0.5,
                anchor: PUXI.FastLayoutOptions.CENTER_ANCHOR,
            }),
        ).setBackground(0xffaabb)
            .setBackgroundAlpha(0.5)
            .addChild(new PUXI.Button({ text: 'Button 1' }).setBackground(0xff))
            .addChild(new PUXI.Button({ text: 'Button 2' })
                .setLayoutOptions(new PUXI.FastLayoutOptions({ x: 0, y: 700, height: 600 }))
                .setBackground(0xff));

        puxiStage.addChild(mockScroll);
        puxiStage.addChild(layout);


        this.graphics = new PIXI.Graphics();
        parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

        // init Pixi loader
        let loader = new PIXI.Loader();

        // Add user player assets
        console.log('Player to load', playerFrames);
        Object.keys(playerFrames).forEach(key => {
            loader.add(playerFrames[key]);
        });

        const resize = () => {
            // Resize the renderer
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        }


        window.addEventListener('resize', resize);

        // Load assets
        loader.load(this.onAssetsLoaded.bind(this));
    }

    private onAssetsLoaded() {

        const playerIdle: PIXI.AnimatedSprite = new PIXI.AnimatedSprite(playerFrames[currentFrame].map(path => PIXI.Texture.from(path)));

        /*
        * An AnimatedSprite inherits all the properties of a PIXI sprite
        * so you can change its position, its anchor, mask it, etc
        */
        playerIdle.x = 130;
        playerIdle.y = 150;
        playerIdle.anchor.set(0, 1);
        // playerIdle.anchor.set(0.5);
        playerIdle.animationSpeed = 0.3;
        playerIdle.filters = [new GlowFilter({
            color: 0xff0000,
        })];
        playerIdle.play();


        var style = { fontFamily: "Helvetica, sans-serif", fill: 'blue' };
        const demoText = new PIXI.Text("01111", style);
        demoText.x = this.app.renderer.screen.width - demoText.width
        demoText.y = 50

        

        this.app.stage.addChild(playerIdle);
        this.app.stage.addChild(demoText);
    }

}
