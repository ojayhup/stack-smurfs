namespace SpriteKind {
    export const Mountain = SpriteKind.create()
    export const Smurf = SpriteKind.create()
}
//% weight=100 color=#3ea8b8 icon="\uf185"
namespace smurfy {
    let smurf_weight = 0
    let smurf: Sprite = null
    let moving_smurf: Sprite = null
    let current_smurf: Sprite = null
    let bottom_smurf: Sprite = null
    let center_of_gravity = 0
    let mountain_smurfs: Sprite[] = []
    let top_smurf: Sprite = null
    let smurf_fell_off = false
    let village: Image[] = []
    export let speed = 60
    village = [assets.image`sit`, assets.image`squat`, assets.image`float`, assets.image`smurfette`, 
    assets.image`jump`, assets.image`ken`, assets.image`profile`]
    scene.onOverlapTile(SpriteKind.Smurf, assets.image`winCloud`, function (sprite, location) {
        game.gameOver(true)
    })
    sprites.onOverlap(SpriteKind.Smurf, SpriteKind.Mountain, function (sprite, otherSprite) {
        sprite.vy = 0
        sprite.ay = 0
        sprite.setKind(SpriteKind.Mountain)
        smurf_fell_off = will_the_smurf_fall_off(sprite, otherSprite)
        if (smurf_fell_off) {
            sprite.startEffect(effects.fire)
        } else if (will_the_stack_fall_down()) {
            sprites.setDataSprite(otherSprite, "smurf on top of me", sprite)
            explode_smurfs()
            pause(1000)
            game.gameOver(false)
        } else {
            top_smurf = sprite
            scene.cameraFollowSprite(sprite)
            sprites.setDataSprite(otherSprite, "smurf on top of me", sprite)
            info.changeScoreBy(1)
        }
        add_floating_smurf()
    })
    // calculate new center of gravity
    function will_the_stack_fall_down() {
        mountain_smurfs = sprites.allOfKind(SpriteKind.Mountain)
        center_of_gravity = 0
        for (let value of mountain_smurfs) {
            center_of_gravity += value.x
        }
        if (center_of_gravity / mountain_smurfs.length < bottom_smurf.left || center_of_gravity / mountain_smurfs.length > bottom_smurf.right) {
            return true
        }
        return false
    }
    function explode_smurfs() {
        current_smurf = bottom_smurf
        while (current_smurf) {
            current_smurf.setFlag(SpriteFlag.Ghost, true)
            current_smurf.setVelocity(randint(-200, 200), randint(-200, 200))
            current_smurf = sprites.readDataSprite(current_smurf, "smurf on top of me")
            scene.cameraFollowSprite(null)
        }
    }
    /**
    * Sets Smurf falling
    */
    //% blockId=drop_smurf 
    //% help=tutorial-only
    //% block="drop Smurf"
    export function drop_smurf() {
        moving_smurf.ay = 300
        moving_smurf.vx = 0
        moving_smurf.setFlag(SpriteFlag.BounceOnWall, false)
    }
    /**
    * Places first Smurf on ground
    */
    //% blockId=first_smurf 
    //% help=tutorial-only
    //% block="set first Smurf $myImage"
    //% myImage.shadow=screen_image_picker
    //% myImage.defl=assets.image`jump`
    //% weight=200
    export function set_first_smurf(myImage: Image) {
        tiles.setTilemap(assets.tilemap`level1`)
        smurf = sprites.create(myImage, SpriteKind.Mountain)
        smurf.ay = 300
        smurf.setPosition(80, 1225)
        scene.cameraFollowSprite(smurf)
        top_smurf = smurf
        smurf_weight = 22
        bottom_smurf = smurf
    }
    /**
    * Loads next Smurf into the air
    */
    //% blockId=add_smurf 
    //% help=tutorial-only
    //% block="new floating Smurf"
    export function add_floating_smurf() {
        speed = 60 + (info.score() * 3)
        moving_smurf = sprites.create(village[randint(0, village.length - 1)], SpriteKind.Smurf)
        if (moving_smurf.image.equals(top_smurf.image)) {
            sprites.destroy(moving_smurf)
            add_floating_smurf()
        } else {
            moving_smurf.bottom = top_smurf.top - 8
            moving_smurf.x = 80
            moving_smurf.setFlag(SpriteFlag.BounceOnWall, true)
            moving_smurf.vx = speed
        }
    }
    function will_the_smurf_fall_off(falling_smurf: Sprite, smurf_stack: Sprite) {
        if (falling_smurf.x > smurf_stack.right) {
            falling_smurf.setVelocity(50, -50)
            falling_smurf.setFlag(SpriteFlag.Ghost, true)
            falling_smurf.setFlag(SpriteFlag.AutoDestroy, true)
            info.changeLifeBy(-1)
            return true
        } else if (falling_smurf.x < smurf_stack.left) {
            falling_smurf.setVelocity(-50, 50)
            falling_smurf.setFlag(SpriteFlag.Ghost, true)
            falling_smurf.setFlag(SpriteFlag.AutoDestroy, true)
            info.changeLifeBy(-1)
            return true
        } else {
            return false
        }
    }
    scene.onHitWall(SpriteKind.Smurf, function (sprite, location) {
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            game.gameOver(false)
        }
    })
}