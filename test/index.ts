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

  it("CustomrPurchase(OrderPurchase): customer order 1 stock success", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8');
    expect(await factory._managers('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8')).to.equal(true);

    await factory.InventoryManagement('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8', 10);
    await factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1, {
      value: ethers.utils.parseEther("1.0")
    });
    
    expect(await factory._acceptedOrder(0)).to.equal('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48');
    expect(await factory._acceptedShip('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48')).to.equal(1);
  });

  
  it("CustomrPurchase(OrderPurchase): customer order 1 stock fail for empty stock", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8');
    expect(await factory._managers('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8')).to.equal(true);

    await expect(factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1, {
      value: ethers.utils.parseEther("1.0")
    })).to.be.revertedWith("Not have enough stock");    
  });

  it("CustomrPurchase(OrderPurchase): customer order 1 stock fail for not funds", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8');
    expect(await factory._managers('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8')).to.equal(true);

    await factory.InventoryManagement('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8', 10);
    await expect(factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1)).to.be.revertedWith("Not have enough funds");    
  });

  it("CustomrPurchase(OrderPurchase): manager cannot order fail", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8');
    expect(await factory._managers('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8')).to.equal(true);

    await factory.InventoryManagement('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8', 10);    
    await expect(factory.OrderPurchase('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8', 1, {
      value: ethers.utils.parseEther("1.0")
    })).to.be.revertedWith("Orderor should not be manager");    
  });

  it("CustomrPurchase(OrderShip): manager ship success", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8');
    expect(await factory._managers('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8')).to.equal(true);

    await factory.InventoryManagement('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8', 10);
    await factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1, {
      value: ethers.utils.parseEther("1.0")
    });

    await factory.OrderShip();
    
    expect(await factory._shipedOrder(0)).to.equal('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48');
  });

  it("CustomrPurchase(OrderShip): customer ship fail", async function () {
    const widgetsFactory = await ethers.getContractFactory("WidgetsFactory");
    const factory = await widgetsFactory.deploy();

    // add manager
    await factory._addManager('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8');
    expect(await factory._managers('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8')).to.equal(true);
    await factory._deleteManager('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(await factory._managers('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).to.equal(false);

    await factory.InventoryManagement('0x0Fc84192A7F161Bff462c03359C543ffE0B3B5D8', 10);
    await factory.OrderPurchase('0xBfE59ff420cB2045f0F4e9CcA266415a485f1F48', 1, {
      value: ethers.utils.parseEther("1.0")
    });

    await expect(factory.OrderShip()).to.be.revertedWith("It should be manager");
  });
});
