controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    music.play(music.createSoundEffect(WaveShape.Sine, 200, 600, 255, 0, 150, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    smurfy.drop_smurf()
    info.startCountdown(10)
})
info.onCountdownEnd(function () {
    info.changeLifeBy(-1)
    info.startCountdown(10)
})
smurfy.set_first_smurf(assets.image`jump`)
scene.setBackgroundColor(9)
smurfy.add_floating_smurf()
info.startCountdown(10)
info.setLife(5)
