'use client'

import { CustomMakeup } from "@/profileActions/customMakeup"
import { MakeupConfig } from "@/types/makeupConfig.type"
import { useState } from "react"
import { toast } from "sonner"
import {
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ColorArea, ColorPicker, ColorSlider, ColorSwatch, Slider } from "@heroui/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"



export default function MakeupCard() {
     
    // makeup state
    const [customFile, setCustomFile] = useState<File | null>(null)
    const [customResult, setCustomResult] = useState<string | null>(null)
    const [customLoading, setCustomLoading] = useState(false)
    
      // hex to BGR
      function hexToBgr(hex: string): number[] {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return [b, g, r]
    }
    
     const [layerColors, setLayerColors] = useState({
      lipstick:  '#dc143c',
      eyeshadow: '#8a2be2',
      blush:     '#ffb6c1',
      eyeliner:  '#000000',
      eyebrows:  '#46281e',
    })
    const [layerIntensity, setLayerIntensity] = useState({
      lipstick:    70,
      eyeshadow:   60,
      blush:       30,
      eyeliner:    2,   
      eyebrows:    40,
      foundation:  20,

    })
    const [layerEnabled, setLayerEnabled] = useState({
      lipstick:    true,
      eyeshadow:   true,
      blush:       true,
      eyeliner:    true,
      eyebrows:    false,
      foundation:  true,
    })
    
    
    function config(): MakeupConfig {
      const cfg: MakeupConfig = {}
      if (layerEnabled.lipstick)
        cfg.lipstick   = { color: hexToBgr(layerColors.lipstick),   intensity: (layerIntensity.lipstick ?? 0) / 100 }
      if (layerEnabled.eyeshadow)
        cfg.eyeshadow  = { color: hexToBgr(layerColors.eyeshadow),  intensity: (layerIntensity.eyeshadow ?? 0) / 100 }
      if (layerEnabled.blush)
        cfg.blush      = { color: hexToBgr(layerColors.blush),      intensity: (layerIntensity.blush ?? 0) / 100 }
      if (layerEnabled.eyeliner)
        cfg.eyeliner   = { color: hexToBgr(layerColors.eyeliner),    thickness: layerIntensity.eyeliner }
      if (layerEnabled.eyebrows)
        cfg.eyebrows   = { color: hexToBgr(layerColors.eyebrows),   intensity: (layerIntensity.eyebrows ?? 0) / 100 }
      if (layerEnabled.foundation)
        cfg.foundation = { intensity: (layerIntensity.foundation ?? 0) / 100 }
     
      return cfg
    }
        
    
    //  base64 and config now exist in scope
    async function handleCustom() {
        if (!customFile) {
          toast.error("Please upload an image first", {
            position: 'top-center', duration: 2000
          })
          return
        }
    
        setCustomLoading(true)
        try {
          // convert File → base64
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(customFile)
          })
    
          const image = await CustomMakeup(base64, config())
          // console.log('CONFIG' ,config);
    
          
          setCustomResult(image)
        } catch (e) {
          console.error(e)
          toast.error("Failed to apply makeup", { position: 'top-center' })
        } finally {
          setCustomLoading(false)
        }
        
    }


  return (
    <>
      
    <CardContent className='flex flex-col gap-4'>
        <Input
        type="file"
        accept="image/*"
        onChange={(e) => setCustomFile(e.target.files?.[0] || null)}
        />
        
        {customFile && (
        <p className='text-sm text-gray-500'>Selected: {customFile.name}</p>
        )}
    
    <div className="border border-pink-300 p-2 rounded-md">
        <ColorPicker
                  
      value={layerColors.lipstick}
      onChange={(color) => {
        setLayerColors(prev => ({
          ...prev,
          lipstick: color.toString("hex"),
        }))
      }}
    >
      <ColorPicker.Trigger>
        <ColorSwatch size="lg" />
        <Label>Lipstick Color</Label>
      </ColorPicker.Trigger>
    
      <ColorPicker.Popover>
        <ColorArea
          aria-label="Color area"
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        >
    
        <ColorArea.Thumb />
            </ColorArea>
            <ColorSlider channel="hue" className="gap-1 px-2" colorSpace="hsb">
              <Label>Hue</Label>
              <ColorSlider.Output className="text-muted" />
              <ColorSlider.Track>
                <ColorSlider.Thumb />
              </ColorSlider.Track>
    
          <ColorArea.Thumb />
    </ColorSlider>
      </ColorPicker.Popover>
    </ColorPicker>
    
    <Slider aria-label='Lipstick Intensity'
      minValue={0}
      maxValue={100}
      value={layerIntensity.lipstick}
      onChange={(val) => {
        setLayerIntensity((prev) => ({
          ...prev,
          lipstick: val as number,
        }))
      }}
    >
      <Label>Lipstick Intensity</Label>
      <Slider.Output />
    </Slider>
    </div>

    <div className="border border-pink-300 p-2 rounded-md">
        <ColorPicker
                  
      value={layerColors.eyeshadow}
      onChange={(color) => {
        setLayerColors(prev => ({
          ...prev,
          eyeshadow: color.toString("hex"),
        }))
      }}
    >
      <ColorPicker.Trigger>
        <ColorSwatch size="lg" />
        <Label>eyeshadow Color</Label>
      </ColorPicker.Trigger>
    
      <ColorPicker.Popover>
        <ColorArea
          aria-label="Color area"
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        >
    
        <ColorArea.Thumb />
            </ColorArea>
            <ColorSlider channel="hue" className="gap-1 px-2" colorSpace="hsb">
              <Label>Hue</Label>
              <ColorSlider.Output className="text-muted" />
              <ColorSlider.Track>
                <ColorSlider.Thumb />
              </ColorSlider.Track>
    
          <ColorArea.Thumb />
    </ColorSlider>
      </ColorPicker.Popover>
    </ColorPicker>
    
    <Slider
    aria-label='eyeshadow Intensity'
      minValue={0}
      maxValue={100}
      value={layerIntensity.eyeshadow}
      onChange={(val) => {
        setLayerIntensity((prev) => ({
          ...prev,
          eyeshadow: val as number,
        }))
      }}
    >
      <Label>eyeshadow Intensity</Label>
      <Slider.Output />
    </Slider>
    </div>

    <div className="border border-pink-300 p-2 rounded-md">
        <ColorPicker
                  
      value={layerColors.blush}
      onChange={(color) => {
        setLayerColors(prev => ({
          ...prev,
          blush: color.toString("hex"),
        }))
      }}
    >
      <ColorPicker.Trigger>
        <ColorSwatch size="lg" />
        <Label>blush Color</Label>
      </ColorPicker.Trigger>
    
      <ColorPicker.Popover>
        <ColorArea
          aria-label="Color area"
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        >
    
        <ColorArea.Thumb />
            </ColorArea>
            <ColorSlider channel="hue" className="gap-1 px-2" colorSpace="hsb">
              <Label>Hue</Label>
              <ColorSlider.Output className="text-muted" />
              <ColorSlider.Track>
                <ColorSlider.Thumb />
              </ColorSlider.Track>
    
          <ColorArea.Thumb />
    </ColorSlider>
      </ColorPicker.Popover>
    </ColorPicker>
    
    <Slider
    aria-label='blush Intensity'
      minValue={0}
      maxValue={100}
      value={layerIntensity.blush}
      onChange={(val) => {
        setLayerIntensity((prev) => ({
          ...prev,
          blush: val as number,
        }))
      }}
    >
      <Label>blush Intensity</Label>
      <Slider.Output />
    </Slider>
    </div>


    <div className="border border-pink-300 p-2 rounded-md">
        <ColorPicker
                  
      value={layerColors.eyeliner}
      onChange={(color) => {
        setLayerColors(prev => ({
          ...prev,
          eyeliner: color.toString("hex"),
        }))
      }}
    >
      <ColorPicker.Trigger>
        <ColorSwatch size="lg" />
        <Label>eyeliner Color</Label>
      </ColorPicker.Trigger>
    
      <ColorPicker.Popover>
        <ColorArea
          aria-label="Color area"
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        >
    
        <ColorArea.Thumb />
            </ColorArea>
            <ColorSlider channel="hue" className="gap-1 px-2" colorSpace="hsb">
              <Label>Hue</Label>
              <ColorSlider.Output className="text-muted" />
              <ColorSlider.Track>
                <ColorSlider.Thumb />
              </ColorSlider.Track>
    
          <ColorArea.Thumb />
    </ColorSlider>
      </ColorPicker.Popover>
    </ColorPicker>
    
    <Slider
    aria-label='eyeliner Intensity'
      minValue={0}
      maxValue={100}
      value={layerIntensity.eyeliner}
      onChange={(val) => {
        setLayerIntensity((prev) => ({
          ...prev,
          eyeliner: val as number,
        }))
      }}
    >
      <Label>eyeliner Intensity</Label>
      <Slider.Output />
    </Slider>
    </div>


    <div className="border border-pink-300 p-2 rounded-md">
        <ColorPicker
                  
      value={layerColors.eyebrows}
      onChange={(color) => {
        setLayerColors(prev => ({
          ...prev,
          eyebrows: color.toString("hex"),
        }))
      }}
    >
      <ColorPicker.Trigger>
        <ColorSwatch size="lg" />
        <Label>eyebrows Color</Label>
      </ColorPicker.Trigger>
    
      <ColorPicker.Popover>
        <ColorArea
          aria-label="Color area"
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        >
    
        <ColorArea.Thumb />
            </ColorArea>
            <ColorSlider channel="hue" className="gap-1 px-2" colorSpace="hsb">
              <Label>Hue</Label>
              <ColorSlider.Output className="text-muted" />
              <ColorSlider.Track>
                <ColorSlider.Thumb />
              </ColorSlider.Track>
    
          <ColorArea.Thumb />
    </ColorSlider>
      </ColorPicker.Popover>
    </ColorPicker>
    
    <Slider
    aria-label='eyebrows Intensity'
      minValue={0}
      maxValue={100}
      value={layerIntensity.eyebrows}
      onChange={(val) => {
        setLayerIntensity((prev) => ({
          ...prev,
          eyebrows: val as number,
        }))
      }}
    >
      <Label>eyebrows Intensity</Label>
      <Slider.Output />
    </Slider>
    </div>
    
    
    
                      <Button
                        onClick={handleCustom}
                        disabled={customLoading}
                        className='bg-pink-500 text-white rounded-md'
                      >
                        {customLoading ? 'Processing...' : 'Apply Custom Makeup'}
                      </Button>
                      {customResult && (
                        <div className="mt-4">
                          <h2 className='font-semibold mb-2'>Result:</h2>
                          <img src={customResult} alt="Custom Makeup Result"  />
                        </div>
                      )}
                    </CardContent>

    </>
  )
}
