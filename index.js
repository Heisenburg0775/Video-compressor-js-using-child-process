#!/usr/bin/env node
import { exec } from "child_process"
import ffmpeg from "ffmpeg"
import boxen from "boxen"
import chalk from "chalk"
const args = process.argv
async function main() {
    try {
        if (!args[2]) {
            console.log(`${chalk.yellow("Usage: ")}input needed_size(in Mib) needed_bitrate(in KiB) ${chalk.red("No input file provided")}`)
        } else {
            if (!args[3]) {
                console.log(`${chalk.yellow("Usage: ")}input needed_size(in Mib) needed_bitrate(in KiB) ${chalk.red("No target size provided")}`)
            } else {
                if (!args[4]) {
                    console.log(`${chalk.yellow("Usage: ")}input needed_size(in Mib) needed_bitrate(in KiB) ${chalk.red("No target bitrate provided")}`)
                } else {
                    const process = await new ffmpeg(args[2])
                    const needed_size = parseInt(args[3])
                    const needed_bitrate = parseInt(args[4])
                    const a_b = process.metadata.audio.bitrate
                    const filename = process.metadata.filename
                    const duration = process.metadata.duration.seconds
                    const v_b = process.metadata.video.bitrate
                    const bitrate = ((needed_size * 8388.608) / duration) - needed_bitrate
                    if(Math.sign(bitrate) === -1 || 0){
                        console.log(chalk.red(`Invalid bitrate: ${bitrate}, Try changing targeted bitrate to get appropiate bitrate`))
                    }
                    else{
                    console.log(boxen(`${chalk.yellow("Filename: ")}${filename}\n${chalk.yellow("Audio Bitrate: ")}${a_b}\n${chalk.yellow("Video bitrate: ")}${v_b}\n${chalk.yellow("Duration(in seconds): ")}${duration}\n${chalk.yellow("Needed bitrate: ")}${needed_bitrate}\n${chalk.yellow("Needed size: ")}${needed_size}\n${chalk.yellow("Calculated bitrate: ")}${bitrate}`, { padding: 1, borderColor: "blue", title: "File Details", borderStyle: "round" }))
                    console.log(chalk.yellowBright("Starting process..."))
                    console.log(chalk.yellow("Checking for ffmpeg..."))
                    exec("ffmpeg -version", (err, output, outputerr) => {
                        if (outputerr.includes("not recognized") === true) {
                            console.log(chalk.red("No ffmpeg found."))
                        } else {
                            exec(`ffmpeg -y -i ${args[2]} -c:v libx264 -b:v ${bitrate}k -pass 1 -an -f null NUL && ^ffmpeg -i ${args[2]} -c:v libx264 -b:v ${bitrate}k -pass 2 -c:a aac -b:a ${bitrate}k output.mp4`)
                            console.log(chalk.green("Ffmpeg found."))
                        }
                    })
                }
                }
            }
        }
    } catch (err) {
        console.log(chalk.red(`Error occured: ${err}`))
    }
}

main()