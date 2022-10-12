import { expect } from "chai";
import { ethers } from "hardhat";

describe("WidgetsFactory", function () {
  it("InventoryManagement: manager add 10 stock success", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8');
    expect(await factory._managers('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8')).to.equal(true);

    await factory.InventoryManagement('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8', 10);
    expect(await factory._getAmount()).to.equal(10);
  });

  it("InventoryManagement: manager add 0 stock fail", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8');
    expect(await factory._managers('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8')).to.equal(true);

    await expect(factory.InventoryManagement('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8', 0)).to.be.revertedWith("The factory has not produced the stock");
  });

  it("InventoryManagement: customer add 10 stock fail", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8');
    expect(await factory._managers('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8')).to.equal(true);

    await expect(factory.InventoryManagement('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 10)).to.be.revertedWith("Customer can not alter stock in inventory");
  });
});
