package main

import (
	"github.com/jesusslim/slimgo"
	"pageRunner/controller"
	_ "pageRunner/model"
)

func main() {
	slimgo.SlimApp.Handerlers.Register(&controller.IndexController{})
	slimgo.Run(":9022")
}
